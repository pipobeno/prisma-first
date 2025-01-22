const { PrismaClient } = require('@prisma/client');

const bcrypt = require("bcrypt");

const hashPasswordExtension = require('../services/extensions/hashPasswordExtension');

const authguard = require('../services/authguard');

const userRouter = require('express').Router();

const prisma = new PrismaClient().$extends(hashPasswordExtension)

userRouter.get('/register', (req, res) => {
    // Chemin à partir du dossier views
    res.render('pages/register.html.twig')
});

userRouter.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, mail, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            throw ({ confirmPassword: "Les mots de passe ne correspondent pas" })
        } else {
            // data : { nom dans le model : req.body.name du formulaire }
            const user = await prisma.user.create({
                data: {
                    firstName: req.body.firstname,
                    lastName: req.body.name,
                    mail: req.body.mail,
                    password: req.body.password
                }
            })
            res.redirect('/login');
        }
    }
    catch (error) {
        if (error.code === "P2002") {
            error = { mail: "Cette adresse mail est déjà utilisée" };
        }
        res.render('pages/register.html.twig', { title: "Inscription", error })
    }
});

userRouter.get('/login', (req, res) => {
    res.render('pages/login.html.twig', { title: "connexion" });
})



userRouter.post('/login', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                mail: req.body.mail
            }
        })
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                req.session.user = user;
                res.redirect('/')
            }
            else throw ({password: "Mot de passe incorrect"});
        }
        else throw ({mail: "mail incorrect"});

    } catch (error) {
        res.render('pages/login.html.twig', { title: "connexion", error });
    }
})

userRouter.get("/",authguard , async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.session.user.id
        },
        include: {
            books: true
        }
    })

    // On pourrais aussi faire ça :
    // const books = await prisma.user.findUnique({
    //     where: {
    //         id: req.session.user.id
    //     }
    // })
    res.render('pages/index.html.twig', {title: "acceuil", user: req.session.user, books:user.books});
})


module.exports = userRouter;