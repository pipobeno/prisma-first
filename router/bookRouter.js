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

bookRouter.get("/deleteBook:/id", authguard, async (req, res) => {
    try {
        const deleteBook = await prisma.book.delete({
            where: {
                id: parseInt{req.params.id}
            }
        })
        
    } catch (error) {
        res.render("/pages/index.html/twig", {error: error})
    }
})

bookRouter.get("/editBook/id")
module.exports = bookRouter;