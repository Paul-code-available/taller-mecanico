import { validarOrden, fechaHoy } from "./validators.js";

import {
    limpiarError,
    limpiarErrores,
    marcarInvalidos,
    mostrarErroresNativos
} from "./ui.js";


const modal = document.querySelector("#modal-orden");

const form = document.querySelector("#form-nueva-orden");

const botonNuevo = document.querySelector("#nuevo");

const botonCerrar = document.querySelector("#cerrar");


function reiniciarFormulario() {
    form.reset();
    limpiarErrores(form);
    form.elements.fecha.value = fechaHoy();
}

form.elements.fecha.max = fechaHoy();
reiniciarFormulario();


botonNuevo.addEventListener("click", () => {
    modal.showModal();
});


botonCerrar.addEventListener("click", () => {
    modal.close();
});


// Cubre Cancelar, la tecla Esc y el envío exitoso
modal.addEventListener("close", reiniciarFormulario);


// Cerrar al hacer clic en el fondo (sin cerrar si se arrastró desde un campo)
let inicioClic = null;

modal.addEventListener("mousedown", e => { inicioClic = e.target; });

modal.addEventListener("click", e => {
    if (e.target === modal && inicioClic === modal) modal.close();
});


// Al corregir un campo se limpia su error
form.addEventListener("input", e => {
    if (e.target.name) limpiarError(form, e.target.name);
});


form.addEventListener("submit", (e) => {

    e.preventDefault();

    // 1. Limpiar errores y validaciones personalizadas anteriores
    limpiarErrores(form);

    // 2. Leer datos
    const datos = Object.fromEntries(new FormData(form));

    // 3. Validar
    const errores = validarOrden(datos);

    // 4. Marcar campos inválidos
    marcarInvalidos(form, errores);

    // 5. Comprobar formulario
    if (!form.checkValidity()) {
        mostrarErroresNativos(form);
        return;
    }

    // 6. Procesar (sin backend por ahora)
    console.log("Nueva orden:", datos);

    reiniciarFormulario();
    modal.close();

    if (typeof toast === "function") {
        toast("Orden registrada correctamente.");
    }

});