const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true para 465, false para todos los demás puertos
  auth: {
    user: 'codediverxia@gmail.com',
    pass: 'kcpaolwcbahbhlly',
  },
});

module.exports = transporter