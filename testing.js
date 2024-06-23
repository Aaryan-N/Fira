let testArray = "Hypixel Network [1.8-1.21],     ARCADE ZOMBIES - NEW MAP! | SB 0.20.2";
const response = testArray.replace(/^\s+|\s+$/g, "").replace(/,/g, "").replace(/\s+$/g, "\n");

console.log(response);