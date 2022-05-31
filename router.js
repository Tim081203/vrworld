const Router = require('express').Router
const router = new Router()
const passport = require('passport')
const controller = require('./controller')
const paypal_controller = require('./paypal-controller')

router.post('/reg',
    controller.registration,
    passport.authenticate('local', {
        successRedirect: "/profile",
        failureRedirect: "/register"
    }));

router.post('/login',
    passport.authenticate('local', {
        successRedirect: "/profile",
        failureRedirect: "/login"
    }));


router.post('/convert', controller.main)

router.get('/logout', controller.logout);

router.get('/vr-products', controller.vr)

router.get('/vr-world', controller.main)

router.get('/', controller.profile)

router.get('/profile', controller.profile)

router.post('/cart/:type', controller.cart)

router.get('/donate_paypal/:amount/:id', paypal_controller.donatePaypal)

router.get('/donate_success/:amount/:id', paypal_controller.donateSuccess)

router.post('/comment', controller.comment)

router.get('/admin', controller.admin)

router.get('/removeUser', controller.removeUser)

router.post('/createUser', controller.createUser)

router.post('/editUser', controller.editUser)

router.get('/promote', controller.promote)


router.get('/register', (req, res) =>  {
    res.sendFile(__dirname + '/front/regist.html');
});

router.get('/login', (req, res) =>  {
    res.sendFile(__dirname + '/front/login.html');
});



module.exports = router