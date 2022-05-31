// data transfer object from user
module.exports = class UserDto{
    id;
    email;
    username;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.username = model.username;
    }
}