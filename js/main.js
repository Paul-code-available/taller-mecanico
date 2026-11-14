import { validarOrden, fechaHoy } from "./validators.js";

import {
    limpiarError,
    limpiarErrores,
    marcarInvalidos,
    mostrarErroresNativos
} from "./ui.js";

// Globales de app.js (script clásico): guardarOrden, swalTema, Swal


const modal = document.querySelector("#modal-orden");

const form = document.querySelector("#form-nueva-orden");

const botonNuevo = document.querySelector("#nuevo");

const botonCerrar = document.querySelector("#cerrar");

// Evita reiniciar el formulario mientras se muestra un aviso fuera del modal
let conservar = false;


function reiniciarFormulario() {
    form.reset();
    limpiarErrores(form);
}

// La fecha de hoy es el valor por defecto, así reset() y la detección de cambios funcionan
form.elements.fecha.max = fechaHoy();
form.elements.fecha.defaultValue = fechaHoy();
reiniciarFormulario();


function hayCambios() {
    return [...form.elements].some(campo => {
        if (!campo.name) return false;

        if (campo.tagName === "SELECT") {
            const porDefecto = [...campo.options].findIndex(o => o.defaultSelected);
            return campo.selectedIndex !== Math.max(porDefecto, 0);
        }

        return campo.value !== campo.defaultValue;
    });
}


/*
 * Un <dialog> abierto con showModal() queda en la capa superior del navegador y tapa
 * a SweetAlert2. Por eso el modal se cierra (sin reiniciar), se muestra el aviso y,
 * si hace falta, se vuelve a abrir con los datos intactos.
 */
async function avisarFuera(opciones) {
    conservar = true;
    modal.close();

    const resultado = await Swal.fire({ ...swalTema(), ...opciones });

    conservar = false;
    return resultado;
}


async function pedirCierre() {

    if (!hayCambios()) {
        modal.close();
        return;
    }

    const { isConfirmed } = await avisarFuera({
        icon: "warning",
        title: "¿Descartar la orden?",
        text: "Se perderán los datos capturados.",
        showCancelButton: true,
        confirmButtonText: "Sí, descartar",
        cancelButtonText: "Seguir editando",
        reverseButtons: true
    });

    if (isConfirmed) reiniciarFormulario();
    else modal.showModal();
}


botonNuevo.addEventListener("click", () => {
    modal.showModal();
});


botonCerrar.addEventListener("click", pedirCierre);


// Tecla Esc: si hay datos escritos, pide confirmación
modal.addEventListener("cancel", e => {
    if (hayCambios()) {
        e.preventDefault();
        pedirCierre();
    }
});


modal.addEventListener("close", () => {
    if (!conservar) reiniciarFormulario();
});


// Clic en el fondo (sin cerrar si se arrastró desde un campo)
let inicioClic = null;

modal.addEventListener("mousedown", e => { inicioClic = e.target; });

modal.addEventListener("click", e => {
    if (e.target === modal && inicioClic === modal) pedirCierre();
});


// Al corregir un campo se limpia su error
form.addEventListener("input", e => {
    if (e.target.name) limpiarError(form, e.target.name);
});


form.addEventListener("submit", async (e) => {

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

    // 6. Guardar en localStorage
    try {
        const orden = await guardarOrden(datos);

        reiniciarFormulario();
        modal.close();

        // La tabla escucha este evento y se vuelve a cargar
        document.dispatchEvent(new CustomEvent("ordenes:cambio"));

        Swal.fire({
            ...swalTema(),
            icon: "success",
            title: "Orden registrada",
            text: `Folio ${orden.folio} · ${orden.cliente}`,
            timer: 2400,
            showConfirmButton: false
        });

    } catch (err) {
        await avisarFuera({
            icon: "error",
            title: "No se pudo guardar la orden",
            text: err.message
        });

        modal.showModal();
    }

});