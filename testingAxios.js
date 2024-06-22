const axios = require("axios");
axios
  .get("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en")
  .then((response) => {
    finalJoke = response.data.text;
  })
  .catch((error) => {
    console.log(error);
  });
