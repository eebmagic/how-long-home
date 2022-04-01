const fs = require('fs');
const life360 = require('life360-node-api');
var nodemailer = require('nodemailer');

const username = fs.readFileSync('USERNAME', 'utf8').trim();
const password = fs.readFileSync('PASSWORD', 'utf8').trim();
const gmailPass = fs.readFileSync('GMAIL_APP_PASS', 'utf8').trim();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eebmagic@gmail.com',
    pass: gmailPass
  }
});

// Login to account
life360.login(username, password).then(client => {
    // Loop over circle members (assumes only one circle)
    client.listCircles().then(circles => {
        circles[0].listMembers().then(members => {

            // Loop through members
            for (const m of members) {
                if (m.firstName === "Ethan") {
                    const lat = parseFloat(m.location.latitude);
                    const long = parseFloat(m.location.longitude);

                    // Log details
                    const start = m.location.since;
                    const current = m.location.timestamp;
                    const durr = current - start;
                    const durrMins = durr / 60000;
                    const durrHours = durrMins / 60;

                    const timeString = durrHours.toFixed(2);
                    const message = `You've been home for ${timeString} hours`;
                    const header = `Been Home: ${timeString} hours`
                    console.log(message);

                    var mailOptions = {
                      from: 'youremail@gmail.com',
                      to: 'eebmagic@gmail.com',
                      subject: header,
                      text: message
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                      }
                    });
                }
            }
        });
    });
});
