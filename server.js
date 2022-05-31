require('dotenv').config()
const dotenv = require('dotenv')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const express = require('express');
const path = require('path');
const router = require('./router')
const admin = require('./admin-panel')

dotenv.config();
require('./passport')(passport)

const app = express()

app.set('view engine', 'ejs')
app.use(cookieParser());
app.use(session({
    secret:process.env.SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        ttl: 7 * 24 *  60 * 60, // 7 Days
    }),
    resave: false,
    saveUninitialized: false
}));
app.use('/adminBro', admin);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

const port = 5000;

app.use(express.static(path.join(__dirname,'front')));

const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(port, () => console.log("http://localhost:" + port))
    }
    catch (e){
        console.log(e)
        process.exit(1)
    }
}
app.use(router)

start()