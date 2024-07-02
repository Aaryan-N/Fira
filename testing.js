const currentDate = new Date(2008,6,12)

const fetchCurrentDate = currentDate.toDateString();
const formattedCurrentDate = fetchCurrentDate.replace(/(19|20)[0-9][0-9]/);

console.log(formattedCurrentDate);