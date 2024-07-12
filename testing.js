let testArray = [ 'No Goal', 60, 'Working discord bot ready for production', 4951 ]
let skbidi = [];

for (let i = 1; i < testArray.length; i+=2) {
    skbidi.push(testArray[i]);
}
console.log(skbidi)

const sigmas = testArray.join('\r\r\n')
const sigma = skbidi.join('\r\r\n')

console.log(sigma.toString())
console.log(sigmas.toString())

