const axios = require("axios");
axios({
    method: 'get',
    url: 'https://icanhazdadjoke.com/',
    responseType: 'json',
    headers: {
        'Accept': "application/json"
    }
})
    .then(function (response) {
        console.log(response.data.joke);
    })
    .catch((err) => {
        console.log("Hey champ! Something went wrong here. Check it out! \n" + err)
        console.log("We are sorry, something has gone terribly wrong. The developer has been notified!");
    });