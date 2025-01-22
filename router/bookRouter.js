const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const authguard = require('../services/authguard');

const bookRouter = require('express').Router();

bookRouter.post("/addBook", authguard, async (req, res) => {
    try {
        const { title, author } = req.body;
        const book = await prisma.book.create({
            data: {
                title,
                author,
                userId: req.session.user.id
            }
        })
        res.redirect("/");
    } catch (error) {
        res.render("/pages/index.html.twig", { error: error });
    }

})

bookRouter.get("/deleteBook/:id", authguard, async (req, res) => {
    try{
        const deleteBook = await prisma.book.delete({
            where:{
                id: parseInt(req.params.id),
                userId: req.session.user.id
            }
        })
        res.redirect("/")
    }
    catch(error){
        res.render("/pages/index.html.twig", {error: error});
    }
})
bookRouter.get("/editBook/:id", authguard, async (req, res) => {
    try{
        const book = await prisma.book.findFirst({
            where:{
                id: parseInt(req.params.id),
                userId: req.session.user.id
            }
        })
        const books = await prisma.book.findMany({
            where:{
                userId: req.session.user.id
            }
        })

        res.render("pages/index.html.twig", {
            book, 
            title:"Accueil", 
            user: req.session.user, 
            books
        })
    }
    catch(error){
        res.render("pages/index.html.twig", {error: error});
    }   
})

bookRouter.post("/editBook/:id", authguard, async (req, res) => {
    try{
        const {title, author} = req.body;
        if(title.match(/^[a-zA-Z0-9]+$/) && author.match(/^[a-zA-Z0-9]+$/)){
            const book = await prisma.book.update({
                where:{
                    id: parseInt(req.params.id),
                    userId: req.session.user.id
                },
                data:{
                    title: req.body.title,
                    author: req.body.author
                }
            })
            res.redirect("/")
        }
        else throw ({error: "Le titre et l'auteur ne peuvent contenir que des lettres et des chiffres"});
    }
    catch(error){
        console.log(error);
        
        res.render("pages/index.html.twig", {
            user:req.session.user, 
            error: error, 
            books : await prisma.book.findMany({
                where:{
                    userId: req.session.user.id
                }
            }),
            book: await prisma.book.findFirst({
                where:{
                    id: parseInt(req.params.id),
                    userId: req.session.user.id
                }
            })
        });
    }
})
module.exports = bookRouter;