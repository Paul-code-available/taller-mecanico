// calculador de IMC
/*
const calcularIMC = (peso, altura) => {

    if (typeof peso !== 'number' 
        || typeof altura !== 'number'
        || peso <= 0 || altura <= 0)  {

        return 'Peso y altura deben ser números y mayores que cero.';

    } 

    let imc = peso / (altura * altura);
    let mensaje = null;

    if (imc < 18.5) {
        mensaje = 'Peso bajo';
    } else if (imc < 25) {
        mensaje = 'Peso normal';
    } else if (imc < 30) {
        mensaje = 'Sobrepeso';
    } else {
        mensaje = "Obesidad";
    }

    return mensaje;

} 

let peso = Number(prompt('Ingresa tu peso en kg:'));
let altura = Number(prompt('Ingresa tu altura en metros:'));
console.log(calcularIMC(peso, altura));
*/

// fizzBuzz
const fizzBuzz = n => {

    if (Number.isNaN(n)
        || n < 1) {
        
        console.error("Debes ingresar un número positivo válido")
        return;
    }

    for (let i = 1; i <= n; i++) {
        
        if (i % 3 === 0 && i % 5 === 0) {
            console.log('fizzBuzz')
        } else if (i % 3 === 0) {
            console.log('Fizz')
        } else if (i % 5 === 0) {
            console.log('Buzz')
        } else {
            console.log(i)
        }
        
    }

}

const entrada = prompt("Ingresa un número:");

if (entrada === null || entrada.trim() === "") {
    console.error("Debes ingresar un número");
} else {
    fizzBuzz(Number(entrada));
}

