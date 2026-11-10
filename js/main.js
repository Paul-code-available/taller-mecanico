import { validarOrden } from "../js/validators.js";

import {
    limpiarErrores,
    mostrarErroresNativos
} from "../js/ui.js";


const modal = document.querySelector("#modal-orden");

const form = document.querySelector("#form-nueva-orden");

const botonNuevo = document.querySelector("#nuevo");

const botonCerrar = document.querySelector("#cerrar");


botonNuevo.addEventListener("click", () => {
    modal.showModal();
});


botonCerrar.addEventListener("click", () => {
    modal.close();
});


form.addEventListener("submit", (e) => {

    e.preventDefault();

    // 1. Limpiar errores anteriores
    limpiarErrores(form);

    // 2. Limpiar validaciones personalizadas anteriores
    [...form.elements].forEach(campo => {
        if (campo.setCustomValidity) {
            campo.setCustomValidity("");
        }
    });

    // 3. Leer datos
    const datos = Object.fromEntries(new FormData(form));

    // 4. Validar
    const errores = validarOrden(datos);

    // 5. Marcar campos inválidos
    Object.entries(errores).forEach(([nombre, mensaje]) => {
        form.elements[nombre].setCustomValidity(mensaje);
    });

    // 6. Comprobar formulario
    if (!form.checkValidity()) {
        mostrarErroresNativos(form);
        return;
    }

    // 7. Actuar
    console.log("Nueva orden:", datos);

    form.reset();
    limpiarErrores(form);
    modal.close();

});