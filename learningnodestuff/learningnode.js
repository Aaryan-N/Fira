console.log("Hello there!");
console.log("4");
console.log(4);
console.log(2 + 4 * 6 - 5 / 3);

let firstname = "Aaryan";
let lastname = "Narayan";
const age = 25;
const superSecretValue = "secret";
let boolTrue = true;
let boolFalse = false;

firstname = "Aaryan";
lastname = "Narayan";


console.log(firstname);
console.log(lastname);
console.log(superSecretValue);
console.log(boolTrue);
console.log(boolFalse);

for (let i = 1; i < 11; i++){
    console.log(i);
}

for (let i = 1; i <= 10; i++){
    console.log(i);
}

for (let i = 1; i <= 10; i += 2){
    console.log(i);
}

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let wordArray = ["Hello", "Hey", "Hi", 55, 22, true, false];
let emptyArray = [];

for (let i = 0; i < arr.length; i++){
    console.log(arr[i]);
}

for (let i = 0; i < wordArray.length; i++){
    console.log(wordArray[i]);
    emptyArray[i] = i;
}

console.log(emptyArray);

if (5 === 5){
    console.log("Numbers match!");
}

if (5 !== 5){
    console.log("Numbers do not match! :(");
}

let mathnumberseq = 1 + 1;
if (mathnumberseq === 2){
    console.log("the value is 2");
}

else if (mathnumberseq == 4){
    console.log("the value is 4");
}

else {
    console.log("the value is not 2 or 4");
}

function myFunction(){
    console.log("inside a function");
}

myFunction();
myFunction();

function myMath(number){
    //number = 4;
    console.log(number);
}

myMath("hi there");

function manyParameters(x, y, z, health, damage, movementSpeed, name){
    console.log(x * y * z);
    console.log("Your health is: " + health);

    if (damage === undefined){
        console.log("You're in tutorial island.");
    }
}

manyParameters(10, 3, 17, 100, undefined, 10, undefined);