var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=332713&date=14-05-2021',
  headers: {
  	'Accept-Language': 'hi_IN',
  	'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

