const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'name is required',
    },
    email: {
        type: String,
        trim: true,
        required: 'email is required',
        unique: 'email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    }
    ,
    password: {
        type: String,
        required: 'password is required'
    },
    profilePhoto: {
        type: String,
        default: 'default.png'
    },
    seller: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


module.exports = model('User', userSchema)


