/* Reglas de validación. No toca el DOM: recibe datos y devuelve { campo: mensaje }. */

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$/;
const texto = v => (v ?? "").trim();

/* Fecha local de hoy en formato YYYY-MM-DD (compatible con <input type="date">) */
export function fechaHoy() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
}

export function validarOrden(datos) {

    const errores = {};

    // Cliente
    const cliente = texto(datos.cliente);
    if (!cliente) errores.cliente = "Escribe el nombre del cliente.";
    else if (cliente.length < 3) errores.cliente = "El nombre debe tener al menos 3 caracteres.";
    else if (cliente.length > 60) errores.cliente = "El nombre no puede superar 60 caracteres.";
    else if (!SOLO_LETRAS.test(cliente)) errores.cliente = "Usa solo letras, espacios, puntos, guiones o apóstrofes.";

    // Vehículo (regla personalizada: debe incluir un año válido)
    const vehiculo = texto(datos.vehiculo);
    const anio = vehiculo.match(/\b(19[89]\d|20\d{2})\b/);
    if (!vehiculo) errores.vehiculo = "Escribe el vehículo.";
    else if (vehiculo.length < 3) errores.vehiculo = "Describe el vehículo con al menos 3 caracteres.";
    else if (vehiculo.length > 40) errores.vehiculo = "El vehículo no puede superar 40 caracteres.";
    else if (!anio || Number(anio[1]) > new Date().getFullYear() + 1)
        errores.vehiculo = "Incluye el año del vehículo (ej. Nissan Versa 2019).";

    // Selectores obligatorios
    if (!texto(datos.servicio)) errores.servicio = "Selecciona un servicio.";
    if (!texto(datos.mecanico)) errores.mecanico = "Selecciona un mecánico.";
    if (!texto(datos.estado)) errores.estado = "Selecciona un estado.";

    // Fecha de ingreso (regla personalizada: no puede ser futura)
    const fecha = texto(datos.fecha);
    if (!fecha) errores.fecha = "Selecciona la fecha de ingreso.";
    else if (fecha > fechaHoy()) errores.fecha = "La fecha de ingreso no puede ser futura.";

    // Total
    const raw = texto(datos.total);
    const n = Number(raw);
    if (!raw) errores.total = "Escribe el total estimado.";
    else if (!Number.isFinite(n)) errores.total = "Ingresa un monto válido.";
    else if (n < 1) errores.total = "El total debe ser de al menos $1.00.";
    else if (n > 999999) errores.total = "El total no puede superar $999,999.";
    else if (!/^\d+(\.\d{1,2})?$/.test(raw)) errores.total = "Usa máximo dos decimales.";

    return errores;
}