let nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_NAME,
        pass: process.env.PASSWORD
    }
})

module.exports = transporter