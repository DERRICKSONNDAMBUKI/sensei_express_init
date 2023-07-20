const jwt = require("jsonwebtoken");
const { cryptojsSecret, jwtSecret } = require("../../config/config");
const User = require("../../models/user.model");
const CryptoJS = require('crypto-js');
const { expressjwt } = require("express-jwt");



const signup = async (req, res) => {
    console.log('> signup...');
    try {
        const { name, email, password } = req.body

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ error: 'user already exists!' })
        } else {
            const encrypted_password = CryptoJS.AES.encrypt(
                password, cryptojsSecret
            ).toString()
            const userSaved = new User({
                name,
                email,
                password: encrypted_password
            })

            // Generate a JWT with the user's information
            const token = jwt.sign({
                _id: userSaved._id
            }, jwtSecret)

            // Set the JWT as a cookie or send it in the response body
            res.cookie('jwt', token,
                { httpOnly: true, secure: true, expire: new Date() + 999 }
            );

            await userSaved.save()
            res.status(200).json({ token, user: userSaved })
        }

    } catch (error) {
        console.error("signup error", error);
        res.status(500).json({ error: error.message })
    }
}


const signin = async (req, res) => {
    console.log('> signin...');
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'user not found' })
        }
        const decrypted_password = CryptoJS.AES.decrypt(user.password, cryptojsSecret)
            .toString(CryptoJS.enc.Utf8)
        if (password !== decrypted_password) {
            return res.status(401).json({ error: 'Invalid password' })
        }

        // Generate a JWT with the user's information
        const token = jwt.sign({
            _id: user._id
        }, jwtSecret)

        // Set the JWT as a cookie or send it in the response body
        res.cookie('jwt', token,
            { httpOnly: true, secure: true, expire: new Date() + 999 }
        );

        // res.cookie('jwt', token, {
        //     expire: new Date() + 9999
        // })

        res.status(200).json({ token, user: user })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const signout = async (req, res) => {
    res.clearCookie('jwt')
    return res.status(200).json({ message: 'signed out' })
}

// const requireSignin = expressjwt({
//     secret: jwtSecret,
//     algorithms: ['HS256'],
//     userProperty: 'auth'
// })

// const hasAuthorization = (req, res, next) => {
//     const authorized = req.user && req.auth && req.profile._id == req.auth._id
//     if (!(authorized)) {
//       return res.status('403').json({
//         error: "User is not authorized"
//       })
//     }
//     next()
//   }

module.exports = {
    signup, signin, signout
    // ,hasAuthorization, requireSignin
}