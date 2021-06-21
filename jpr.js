const https = require('https');
const notifier = require('node-notifier');
var axios = require('axios');
var moment = require('moment'); // require
var nodemailer = require('nodemailer');
moment().format();
const dotenv = require('dotenv');
dotenv.config();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const pincodes = process.env.JPR_PINCODES.split(',')

let day = moment().format("DD-MM-YYYY");
// 14-05-2021


pincodes.forEach(pincode => {

  let url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${day}`

  var config = {
    method: 'get',
    url: url,
    headers: {
      'Accept-Language': 'hi_IN',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
    }
  };

  axios(config)
    .then(function(response) {

      const data = response.data;
      const centers = data.centers;

      centers.forEach(center => {
        let name = center.name
        let pincode = center.pincode
        let sessions = center.sessions
        let n = sessions.length

        for (let i = 0; i < n; i++) {
          let date = sessions[i].date
          let available_capacity = sessions[i].available_capacity_dose1
          let min_age_limit = sessions[i].min_age_limit
          var formatted_date = moment(date, 'DD-MM-YYYY').format('LL');

          let vaccine = sessions[i].vaccine

          let message = `Date: ${formatted_date} \n pincode: ${pincode} \n Age: ${min_age_limit} \n vaccine: ${vaccine} \n Available Dose: ${available_capacity}`;

          if (available_capacity > 0) {
            // notifier.notify({
            //   title: formatted_date,
            //   message: message,
            //   timeout: false,
            //   sound: './ringtone.mp3',
            //   open: 'https://selfregistration.cowin.gov.in/'
            // });

            var mailList = process.env.JPR_MAILS.split(',')


            var mailOptions = {
              from: process.env.GMAIL_USER,
              to: mailList,
              subject: `💉 Vaccine Slot ${formatted_date}, Available: ${available_capacity}, Age: ${min_age_limit}, Pincode: ${pincode} `,
              text: `Slot Capacity: ${available_capacity} \n Hospital: ${name} \n ${formatted_date} \n age: ${min_age_limit} \n Pincode: ${pincode} \n https://selfregistration.cowin.gov.in/`
            };

            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }

        }

      });

      console.log(JSON.stringify(response.data));
    })
    .catch(function(error) {
      console.log(error);
    });
})