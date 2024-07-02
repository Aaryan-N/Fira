const currentDate = new Date(2008, 6, 12)

const fetchCurrentDateMonth = currentDate.getMonth();
const fetchCurrentDateDate = currentDate.getDate();
const formattedDateMonth = fetchCurrentDateMonth.toString();
const formattedDateDate = fetchCurrentDateDate.toString();
const formattedDate = formattedDateDate.concat(" ")
const formattedDateAndMonth = formattedDate.concat(formattedDateMonth)
console.log(formattedDateAndMonth);

console.log(formattedDateAndMonth === "12 6");