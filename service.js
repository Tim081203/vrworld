const bcrypt = require('bcrypt')
const UserModel = require('./user-model')
const UserDto = require('./user-dto')

class Service {
    async registration(email, username, password, country) {
        const candidate = await UserModel.findOne({email})
        if (candidate) return

        const hashPassword = await bcrypt.hash(password, 4) // hash the password
        const user = await UserModel.create({
            email,
            username,
            password: hashPassword,
            country,
        }) // save user to database
        const userDto = new UserDto(user) // (data to transfer) id, email, isActivated, roles

        return {user: userDto}
    }
    async login(email, password, done) {
        const user = await UserModel.findOne({email})
        if (!user) {
            done(null, false)
            return
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            done(null, false)
            return
        }
        const userDto = new UserDto(user)

        done(null, user)

        return {user: userDto}
    }
}
module.exports = new Service()
