// import ejs from "ejs";
// import { transporter } from "../utils/nodeMailer.js";

// /* send email on dfrnt events */

// export let sendWelcomeEmail = (obj) => {
//     ejs.renderFile(
//         global.appRoot + "/templates/welcome.ejs",
//         { ...obj },
//         function (err, data) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 let info = transporter.sendMail({
//                     from: "Hamza Flaws", // sender address
//                     to: obj.to, // list of receivers
//                     subject: "Welcome ✔", // Subject line
//                     html: data, // html body
//                 });
//             }
//         }
//     );
// };

// export let forgetPasswordEamil = (obj) => {
//     ejs.renderFile(
//         global.appRoot + "/templates/forgetPassword.ejs",
//         { ...obj },
//         function (err, data) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 let info = transporter.sendMail({
//                     from: "Hamza Flaws", // sender address
//                     to: obj.to, // list of receivers
//                     subject: "Forget Password", // Subject line
//                     html: data, // html body
//                 });
//             }
//         }
//     );
// };

// export let placedOrderEmail = (obj) => {
//     ejs.renderFile(
//         global.appRoot + "/templates/orderPlaced.ejs",
//         { ...obj },
//         function (err, data) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 let info = transporter.sendMail({
//                     from: "Hamza Flaws", // sender address
//                     to: obj.email || "", // list of receivers
//                     subject: "Order Placed", // Subject line
//                     html: data, // html body
//                 });
//             }
//         }
//     );
// };

// export let alertAdminOnNewOrderPlaced = (obj) => {
//     ejs.renderFile(
//         global.appRoot + "/templates/newOrderAlert.ejs",
//         { ...obj },
//         function (err, data) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 let info = transporter.sendMail({
//                     from: "Hamza Flaws", // sender address
//                     to: ["muhamedusama468@gmail.com"], // Clothing.faboo@gmail.com  list of admin
//                     subject: "New Order Arrived", // Subject line
//                     html: data, // html body
//                 });
//             }
//         }
//     );
// };

// const nodemailer  = require('nodemailer');
// const path        = require('path');
// const fs          = require('fs');
// const handlebars  = require('handlebars');
//
// const PasswordController = require('../Controllers/PasswordController');
// const GeneralHelper = require('./GeneralHelper');
// const ResponseHelper = require('./ResponseHelper');
// const ResponseCode = require('../Constants/ResponseCode');
//
//
// // Constants
// const Message     = require("../Constants/Message.js");
//
//
// // function createTransport() {
// //     return nodemailer.createTransport({
// //         host:  process.env.MAIL_HOST,
// //         secureConnection:  process.env.MAIL_SECURE,
// //         port:  process.env.MAIL_PORT,
// //         auth: {
// //             user:  process.env.MAIL_EMAIL,
// //             pass:  process.env.MAIL_PASSWORD,
// //         }
// //     });
// // }
//
// //
// // async function verifyTransport(transport) {
// //
// // 	let res;
// // 	await transport.verify(function(error, success) {
// //        if (error) {
// //             console.log(error);
// //             res = error;
// //        } else {
// //        		res = success;
// //             console.log('Server is ready to take our messages');
// //        }
// //     });
// //
// //     return res;
// // }
// //
// // function generateHtmlToSend(fileName,replacements)
// // {
// //     const filePath = path.join(__dirname,'../Mails/'+fileName);
// //     const source = fs.readFileSync(filePath, 'utf-8').toString();
// //     const template = handlebars.compile(source);
// //     return template(replacements);
// // }
// //
// // function setMailOptions(email,subject,fileName,replacements)
// // {
// // 	return mailOptions ={
// //         from:  process.env.MAIL_FROM,
// //         to: email,
// //         subject: subject,
// //         html:generateHtmlToSend(fileName,replacements),
// //     };
// // }
// //
// // async function sendEmail(subject,fileName,email,replacements)
// // {
// // 	const transport = createTransport();
// // 	const transportVerify = await verifyTransport(transport);
// // 	const mailOptions = setMailOptions(email,subject,fileName,replacements);
// //
// // 	await transport.sendMail(mailOptions, function (error, info) {
// //         if (error) {
// //             console.log(error);
// //         } else {
// //             console.log('Email sent: ' + info.response);
// //         }
// //     });
// // }
// //
// //
// // function sendForgotPasswordEmail(email,replacements){
// //     sendEmail(
// //             Message.RESET_PASSWORD,
// //             "forgot-password.html",
// //             email,
// //             replacements);
// // }
// //
//
// exports.sendEmail = async (req,res,next)=> {
//     //activationCode,
//     //email,
//     //subject,
//     //message
//
//     //step1
//     let transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.PASSWORD,
//         },
//     });
//     const forgotCode = await GeneralHelper.getRandomCode();
//     await PasswordController.setForgotCode(req.body.email, forgotCode);
//     const email = req.body.email;
//     const message = 'Your Code is ' + forgotCode;
//     //step2
//     let mailOption = {
//         from: process.env.EMAIL,
//         to: email,
//         subject: 'Forgot Password ',
//         text: message,
//         // attachments: [
//         //   {
//         //     filename: "picture.JPG",
//         //     path: imagepath,
//         //   },
//         // ],
//     };
//
//     //step3
//
//     await transporter.sendMail(mailOption, function (err, data) {
//         if (err) {
//             let response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.WENT_WRONG);
//             return res.status(response.code).json(response);
//         }
//
//         //console.log(imagepath);
//         else {
//             let response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFULL);
//             return res.status(response.code).json(response);
//         }
//     });
// Libraries
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

// Constants
// const Message = require("../Constants/Message.js");


function createTransport() {
    console.log({MAIL_FROM: process.env.MAIL_FROM});
    return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        secureConnection: true,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_FROM,
            pass: process.env.MAIL_PASSWORD,
        }
    });
}


async function verifyTransport(transport) {

    let res;
    await transport.verify(function (error, success) {
        if (error) {
            console.log(error);
            res = error;
        } else {
            //res = success;
            console.log('Server is ready to take our messages');
        }
    });
}

function generateHtmlToSend(fileName, replacements) {
    const filePath = path.join(__dirname, '../Mails/' + fileName);
    const source = fs.readFileSync(filePath, 'utf-8').toString();

    const template = handlebars.compile(source);

    return template(replacements);
}

function setMailOptions(email, subject, fileName, replacements) {
    console.log({from: process.env.MAIL_FROM});
    return mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: subject,
        html: generateHtmlToSend(fileName, replacements),
    };
}

async function sendEmail(subject, fileName, email, replacements) {
    const transport = createTransport();
    const transportVerify = await verifyTransport(transport);
    const mailOptions = setMailOptions(email, subject, fileName, replacements);

    await transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


function sendForgotPasswordEmail(email, replacements) {
    sendEmail(
        "Reset Password",
        "forgot-password.html",
        email,
        replacements);
}

function sendSignUpEmail(email,){
    sendEmail(
        "Sign Up Successful",
        "sign-up.html",
        email,
          );
}


module.exports = {sendForgotPasswordEmail,sendSignUpEmail}