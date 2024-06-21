function celsiusToFahrenheit(celsius) {
    const fahrenheitOut = (celsius * 1.8) + 32;
    console.log(celsius + " Celsius = " + fahrenheitOut + " Fahrenheit");
}
function fahrenheitToCelsius(fahreneheit) {
    const celsiusOut = (fahreneheit - 32) * (5/9);
    console.log(fahreneheit + " Fahrenheit = " + celsiusOut + " Celsius");

    if (50> celsiusOut > 30) {
        console.log("The temperature is very high!")
    }

    if (celsiusOut >= 50) {
        console.log("The temperature is deadly high! Stay safe.")
    }
}

celsiusToFahrenheit(20);
fahrenheitToCelsius(400);