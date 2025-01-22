const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const authguard = require('../services/authguard');

const bookRouter = require('express').Router();

bookRouter.post("/addBook", authguard, async (req, res) => {
    try {
        const {title, author} = req.body;
        const book = await prisma.book.create({
            data: {
                title, 
                author,
                userId: req.session.user.id
            }
        })
        res.redirect("/");
    } catch (error) {
        res.render("/pages/index.html.twig", {error: error});
    }

})

module.exports = bookRouter;