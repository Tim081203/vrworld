const userService = require('./service')
const goodsModel = require('./goods-model')
const userModel = require('./user-model')
const Comment = require('./comment-model')
const CC = require('currency-converter-lt')
const UserModel = require("./user-model");
const bcrypt = require("bcrypt");

class Controller {
    async registration(req, res, next) {
        try {
            const {email, username, password, country} = req.body
            await userService.registration(email, username, password, country)
            return next()
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            req.logout()
            res.redirect('back')
        } catch (e) {
            next(e)
        }
    }

    async profile(req, res, next) {
        try {
            if (req.user == null) return res.redirect('/login')

            const user = await userModel.findOne({_id: req.user._id})
            const cart = await goodsModel.find({user: user})
            res.render('profile.ejs', {user: user, cart: cart})
        } catch (e) {
            next(e)
        }

    }

    async cart(req, res, next) {
        try {
            const gb = req.body.gb
            const user = await userModel.findOne({_id: req.user._id})
            if (!user) return
            let cost
            if (gb === '64') cost = 100
            else if (gb === '128') cost = 150
            else if (gb === '256') cost = 200
            else return

            cost *= req.body.quantity

            await goodsModel.create({
                type: req.params.type,
                user: user,
                gb: gb,
                quantity: req.body.quantity,
                cost: cost
            })
            res.redirect('/profile')
        } catch (e) {
            next(e)
        }
    }

    async main(req, res, next) {
        try {
            const comments = await Comment.find().populate('user')
            if (req.body != null) {
                let currencyConverter = new CC()
                currencyConverter.from("USD").to("KZT").amount(parseInt(req.body.cur)).convert().then((response) => {
                    res.render('main', {com: comments, sum: response})
                })
            }
        } catch (e) {
            next(e)
        }
    }

    async comment(req, res, next) {
        try {
            if (req.user == null) return
            req.body.user = req.user._id
            await Comment.create(req.body)
            res.redirect('/vr-world')
        } catch (e) {
            next(e)
        }
    }

    async vr(req, res, next) {
        res.render('vr_products.ejs')
    }

    async admin(req, res, next) {
        const user = await userModel.findOne({_id: req.user._id})
        let hasRole = false
        user.roles.forEach(role => {
            if ("ADMIN".includes(role))
                hasRole = true
        })

        if (!hasRole) return res.send('You don\'t have an administrator role')

        const users = await userModel.find()
        res.render('admin', {users: users})
    }

    async removeUser(req, res, next) {
        try {
            const user = await userModel.findOne({_id: req.cookies.id})
            let hasRole = false
            user.roles.forEach(role => {
                if ("ADMIN".includes(role))
                    hasRole = true
            })
            if (hasRole) return res.send('You can\'t delete him because he is an administrator')
            await userModel.deleteOne({_id: req.cookies.id})
            res.redirect('back')
        }
        catch (e) {
            next(e)
        }
    }

    async createUser(req, res, next) {
        try {
            const candidate = await UserModel.findOne({email: req.body.email})
            if (candidate) return res.redirect('back')
            const pass = req.body.password
            const hashPassword = await bcrypt.hash(pass, 4)
            await UserModel.create({
                email: req.body.email,
                username: req.body.username,
                password: hashPassword,
                country: req.body.country,
            })
            res.redirect('back')
        } catch (e) {
            next(e)
        }
    }
    async editUser(req, res, next) {
        try {
            await UserModel.findOneAndUpdate({_id: req.cookies.id}, {
                email: req.body.email,
                username: req.body.username,
                country: req.body.country,
            })
            res.redirect('back')
        }
        catch (e) {
            next(e)
        }
    }
    async promote(req, res, next) {
        try {
            await userModel.findOneAndUpdate({_id: req.cookies.id}, {
                roles: "ADMIN"
            })
            res.redirect('back')
        }
        catch (e) {
            next(e)
        }
    }

}

module.exports = new Controller()