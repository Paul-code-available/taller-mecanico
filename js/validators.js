export function validarOrden(datos) {

    const errores = {};

    if (datos.cliente.trim().length < 3) {
        errores.cliente = "El nombre debe tener al menos 3 caracteres";
    }

    return errores;
}