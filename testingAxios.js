const axios = require("axios");

const serverAddress = "mc.hypixel.net"
axios({
    method: 'get',
    url: `https://api.mcsrvstat.us/3/${serverAddress}`,
    responseType: 'json'
})
    .then(function (response) {
        console.log(response.data.motd.clean);
    });