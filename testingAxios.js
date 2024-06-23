const {request} = require("undici");

async function lol(){
const jokeResult = await request('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
const file  = await jokeResult.body.text;
console.log(file);
}

lol();