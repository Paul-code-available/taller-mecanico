export function limpiarErrores(form) {

    form.querySelectorAll("[data-error-para]")
        .forEach(span => span.textContent = "");

    form.querySelectorAll(".invalido")
        .forEach(campo => campo.classList.remove("invalido"));
}


export function mostrarError(form, nombre, mensaje) {

    const span = form.querySelector(
        `[data-error-para="${nombre}"]`
    );

    const campo = form.elements[nombre];

    if (span) {
        span.textContent = mensaje;
    }

    if (campo) {
        campo.classList.add("invalido");
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