function kilosToPounds(kg) {
    return kg * 2.2046;
}

function poundsToKilos(lbs) {
    return lbs * 0.45359237;
}

function metricTons(kg) {
    return Math.floor(kg / 1000);
}

let kilosResult = kilosToPounds(1000000);

console.log(kilosResult);

let poundsResult = poundsToKilos(1000000);

console.log(poundsResult);

console.log(metricTons(poundsResult) + ' metric tons.');