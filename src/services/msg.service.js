export const msgservice = {
  sendMsg
}

const axios = require("axios");


// send sms
const postData = {
  from: "447537404817",
  to: ["972506555525"],
  body: "This is a test message from your Sinch account",
};

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer d6d3b4484bfb4e8a9fde393100d9ce6e",
  },
};
 
function sendMsg(){
  axios
    .post(
      "http://sms.api.sinch.com/xms/v1/a4e710cc9a8f4ad1a6d6985369fa0afe/batches",
      postData,
      axiosConfig
    )
    .then((json) => {
      console.log(json);
    })
    .catch((error) => {
      console.error(error);
    });
}


// send whatsapp

var botId = 'your-received-bot-id';
var phoneNbr = 'your-phone-number-which-is-whatsapp-enabled';
var bearerToken = 'your-received-bearer-token';

var url = 'https://us1.whatsapp.api.sinch.com/whatsapp/v1/' + botId + '/messages';
var data = {
  to: [phoneNbr],
  message: {
    type: 'template',
    template_name: 'sinch_tutorial',
    params: ['<recipient_name>']
  }
};

var postReq = {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + bearerToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data),
  json: true
};
