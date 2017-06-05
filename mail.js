import nodemailer = require('nodemailer')
import md5 = require('MD5')
let smtpTransport  = null;
let urlConfirmMail = null;
let mailOptions    = {
  from: '', to: '', subject: '', html: '', text: ''
};

export const init = function (conf) {
  urlConfirmMail = conf.APP.CONFIRM_ACCOUNT_LINK;
  smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: conf.MAIL.USER, pass: conf.MAIL.PASS }
  });
  mailOptions.from = conf.MAIL.USER;
};

export const sendMail = function (to, subject, body, isHtmlBody) {
  mailOptions.to = to;
  mailOptions.subject = subject;
  if (isHtmlBody) {
    mailOptions.html = body;
  } else {
    mailOptions.text = body;
  }
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + response.message);
    }  // if you don't want to use this transport object anymore, uncomment following line
       //smtpTransport.close(); // shut down the connection pool, no more messages
  });
};
export const sendConfirmateMail = function (to) {
  var subject = 'Por favor, confirma tu email. Eatnow!',
      token   = md5(Date() + to),
      html    = getLinkConfirmate(to, token);
  //this.sendMail(to, subject, html, true);
  return token;
};

function getLinkConfirmate(to, token) {
  return '<a href="' + urlConfirmMail + '/' + token + '"> Click aqui para confirmar</a>';
}
