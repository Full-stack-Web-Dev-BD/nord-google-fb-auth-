const customValidator = require('../validator/customValidator')
const userModel = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sendMail } = require('../mailer')
const jwtDecode =require('jwt-decode')

const register = (req, res) => {
    const verify = customValidator.registerValidator(req)
    if (!verify.isValid) {
        return res.status(400).json(verify.error)
    }
    userModel.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ massage: "User existing !!!" })
            }
            bcrypt.hash(req.body.password, 13, (err, hash) => {
                if (err) {
                    return res.status(500).json({ massage: "Server error !!!" })
                }
                new userModel({
                    username: req.body.name,
                    email: req.body.email,
                    password: hash,
                    active: false,
                    time_created: new Date()
                }).save()
                    .then(user => {

                        let token = jwt.sign({
                            _id: user._id,
                            name: user.username,
                            email: user.email
                        }, 'st_app', { expiresIn: '4h' })

                        let link = `http://localhost:5000/confirm/${token}`
                        sendMail(req.body.name, req.body.email,link)
                        res.status(200).json({ massage: 'Register successfull ! Please check your mail and confirm the Registration !', link:link })
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(500).json({ massage: "Server error !!" })
                    })
            })
        })
}

const login = (req, res) => {
    const { email, password } = req.body
    let verify = customValidator.loginValidator(req)
    if (!verify.isValid) {
        return res.status(400).json(verify.err)
    }
    userModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ massage: "User not founded !!" })
            }
            if (!user.active) {
                return res.status(400).json({ massage: "Please check your mail and confirm the registration at first " })
            }
            bcrypt.compare(password, user.password, (err, success) => {
                if (err) {
                    return res.status(500).json({ massage: "Servder error occurd" })
                }
                if (!success) {
                    return res.status(400).json({ massage: "Wrong password provided!!" })
                }
                let token = jwt.sign({
                    _id: user._id,
                    name: user.username,
                    email: user.email
                }, 'st_app', { expiresIn: '4h' })

                return res.status(200).json({ token: token })
            })
        })
}
const getSingleUser = (req, res) => {
    userModel.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(400).json({ massage: "Bad request" })
            }
            return res.status(200).json(user)
        })
        .catch(err => {
            return res.status(500).json({ massage: "Server error occurd " })
        })
}
const socialLogin = (req, res) => {
    userModel.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                let token = jwt.sign({
                    _id: user._id,
                    name: user.username,
                    email: user.email
                }, 'st_app', { expiresIn: '4h' })
                return res.status(200).json({ token: token })
            }
            new userModel({
                username: req.body.name,
                email: req.body.email,
                password: '',
                active: false,
                time_created: new Date()

            }).save()
                .then(user => {
                    if (user.password) {
                        let token = jwt.sign({
                            _id: user._id,
                            name: user.username,
                            email: user.email
                        }, 'st_app', { expiresIn: '4h' })
                        return res.status(200).json({ token: token })
                    } else {
                        let token = jwt.sign({
                            _id: user._id,
                            name: user.username,
                            email: user.email,
                        }, 'st_app', { expiresIn: '4h' })
                        return res.status(200).json({ token: token })
                    }
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).json({ massage: "Server error !!" })
                })
        })
}
const confirmation=(req, res)=>{
    let jwt=req.params.jwt
    let decoded=jwtDecode(jwt)
    userModel.findOne({email:decoded.email})
    .then(user=>{
        user.active=true
        user.save()
        .then(updated=>{
            res.send("Confirmation successfull")
        })
        .catch(err=>{
            res.send("Error")
        })
    })
}
module.exports = {
    getSingleUser,
    register,
    login,
    socialLogin,
    confirmation
}