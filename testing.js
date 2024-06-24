const axios = require("axios");

const formattedUserBallQuery= "skbidi"

axios({
    method: "get",
    url: `https://eightballapi.com/api?question=${formattedUserBallQuery}`,
    responseType: "json",
})
    .then(function (response) {
        console.log(response.data.reading)
    })
    .catch((err) => {
        console.log(err);
    })