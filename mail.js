var auth = require('./auth.json');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({ // SMTP
  service: auth.mail.service,
  auth: auth.mail.auth
});

var defOpts = {
  from: auth.mail.auth.user,
  to: '',
  subject: '',
  text: '',
  html: ''
};

function sendMail(opts, callback) {
  opts.from = defOpts.from;
  transporter.sendMail(opts, callback);
};

return {
  sendMail: sendMail
}