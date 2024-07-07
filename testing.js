const moment = require("moment");

const year = 2008
const month = 12
const day = 41

const jsDateValidator = year+"-"+month+"-"+day

const momentJsDateValidator = moment(jsDateValidator, "YYYY MM DD");

console.log(momentJsDateValidator.isValid());
