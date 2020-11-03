const nodemailer = require('nodemailer');
const log = console.log;


require('dotenv').config();

const sendMail=(name,email,link) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL || 'abc@gmail.com', // TODO: your gmail account
            pass: process.env.PASSWORD || '1234' // TODO: your gmail password
        }
    });

    let mailOptions = {
        from: `noReplay@gmail.com`, // TODO: email sender
        to: `${email}`, // TODO: Pls use your email here for recive email
        subject: `Confirmation SMS`,
        text: `Hi  ${name}, Please click on this link to confirm your account ${link}`//you can write your work here 
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err)
            return log('Error occurs');
        }
        console.log(data)
        res.json({message:'email sent '})
        return log('Email sent!!!');
    });
}

module.exports={
    sendMail
}