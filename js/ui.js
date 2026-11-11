/* Funciones de interfaz: muestran y limpian errores. Sin reglas de negocio. */

export function limpiarError(form, nombre) {

    const span = form.querySelector(`[data-error-para="${nombre}"]`);
    const campo = form.elements[nombre];

    if (span) span.textContent = "";

    if (campo) {
        campo.classList.remove("invalido");
        campo.removeAttribute("aria-invalid");
        campo.setCustomValidity("");
    }
}


export function limpiarErrores(form) {

    [...form.elements]
        .filter(campo => campo.name)
        .forEach(campo => limpiarError(form, campo.name));
}


/* Registra en cada campo el mensaje devuelto por validators.js */
export function marcarInvalidos(form, errores) {

    Object.entries(errores).forEach(([nombre, mensaje]) => {
        form.elements[nombre]?.setCustomValidity(mensaje);
    });
}


export function mostrarError(form, nombre, mensaje) {

    const span = form.querySelector(`[data-error-para="${nombre}"]`);
    const campo = form.elements[nombre];

    if (span) span.textContent = mensaje;

    if (campo) {
        campo.classList.add("invalido");
        campo.setAttribute("aria-invalid", "true");
    }
}


export function mostrarErroresNativos(form) {

    const invalidos = [...form.elements]
        .filter(campo => campo.name && !campo.checkValidity());

    invalidos.forEach(campo => {
        mostrarError(form, campo.name, campo.validationMessage);
    });

    invalidos[0]?.focus();
}