const sendNotification = (message, playerId) => {
    const data = { 
        app_id: "df4cae47-cd9d-4dd5-b97f-5f63593f39fb",
        contents: message,
        include_player_ids: [playerId]
      };

    const headers = {
      "Content-Type": "application/json; charset=utf-8"
    };
    
    const options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };
    
    const https = require('https');
    const req = https.request(options, function(res) {  
      res.on('data', function(data) {
        console.log("Response:");
        console.log(JSON.parse(data));
      });
    });
    
    req.on('error', function(e) {
      console.log("ERROR:");
      console.log(e);
    });
    
    req.write(JSON.stringify(data));
    req.end();
  };

  module.exports = sendNotification