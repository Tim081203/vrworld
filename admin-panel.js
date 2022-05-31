const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')

const mongoose = require('mongoose')

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
    databases: [mongoose],
    rootPath : '/adminBro'
})

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        try {
            return email === "admin" && password === "admin";
        } catch (e) {
            console.log(e)
        }
    }
})

module.exports = router