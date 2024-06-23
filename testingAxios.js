const axios = require("axios");

let finalJoke = "";

async function fetchJoke() {
    try {
        const { data }  = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
        this.chart = data;
        console.log(this.chart);
    } catch (error) {
        console.log(error)
    }
}