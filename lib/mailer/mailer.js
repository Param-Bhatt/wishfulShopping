const nodemailer = require('nodemailer')
const settings = require('../../settings')
const path = require('path')
var ejs = require('ejs')

var sendMail = (to, subject, body) => {
    return new Promise((resolve, reject)=> {
    let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: settings.MAIL_USER,
        pass: settings.MAIL_PASSWORD
    }
    });
      
    let mailDetails = {
        from: settings.MAIL_USER,
        to: to,
        subject: subject,
        text: body
    };

    mailTransporter.sendMail(mailDetails, function(err, response) {
      if(err) {
          console.log('Error Occurs');
          err.message = 'Error in sending mails, mailer.js';
          reject(err);
          return
      } else {
          console.log(response);
          resolve(1);
      }
      mailTransporter.close();
    });
    
  })    
}

/*var sendMail = (to, subject, body) => {
    return new Promise((resolve, reject) => {
      if (isProduction) {
        if (mailSet) {
          ejs.renderFile(path.join(settings.PROJECT_DIR, 'views', 'mail.ejs'), { details: body }, (err, data) => {
            if (err) {
              err.message = 'Error sending emails'
              reject(err)
              return
            }
            const mailOptions = {
              from: settings.MAIL_USER,
              to: to,
              subject: subject,
              generateTextFromHTML: true,
              html: data
            }
            transporter.sendMail(mailOptions, (error, response) => {
              if (error) {
                reject(error)
                return
              } else {
                console.log(response);
                resolve(1)
              }
              transporter.close()
                        })
          })
        } else {
          reject(new Error('Invalid mail credentials'))
        }
            } else {
                  console.log('Not in production, will not send actual mails')
                  console.log('---------Fake email--------')
                  console.log(`Mail sent to : ${to} Subject : ${subject}, Body : ${body}`)
        console.log('---------------------------')
        resolve(1)
            }
    })
  }*/
  
module.exports = sendMail
  