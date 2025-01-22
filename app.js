const express = require('express');
const userRouter = require('./router/userRouter')
const session = require('express-session');
const bookRouter = require('./router/bookRouter');



const app = express();
app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }))
app.use(session({ 
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))
app.use(userRouter);

app.use(bookRouter);


app.listen(3000, () => {
    console.log('server is running on port 3000');
});