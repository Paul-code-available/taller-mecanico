
const reparaciones = [
    { id: 1, vehiculo: "Toyota Corolla", costo: 1500, horas: 3, estado: "Terminado" },
    { id: 2, vehiculo: "Honda Civic", costo: 2500, horas: 5, estado: "Pendiente" },
    { id: 3, vehiculo: "Nissan Versa", costo: 800, horas: 2, estado: "Terminado" },
    { id: 4, vehiculo: "Ford Focus", costo: 3200, horas: 6, estado: "En proceso" },
    { id: 5, vehiculo: "Chevrolet Aveo", costo: 1200, horas: 3, estado: "Pendiente" }
];

// copia del arreglo
const copiaOriginal = [...reparaciones];

// filtrar
const filtrados = reparaciones.filter(
    ({ estado }) => estado === "Pendiente"
);

// costo total 
const total = reparaciones.reduce(
    (acumulador, { costo }) => acumulador + costo,
    0
);

// costo promedio 
const promedio = reparaciones.reduce(
    (acumulador, { costo }) => acumulador + costo,
    0
) / reparaciones.length;

// ordenar costo de reparaciones de menor a mayor
const ordenados = [...reparaciones].sort(
    (a, b) => a.costo - b.costo
);

// optional chaining y nullish coalescing
const primerVehiculo = reparaciones[0]?.vehiculo ?? "Sin vehículo";

// resultados
console.log({
    filtrados,
    total,
    promedio,
    ordenados,
    primerVehiculo
});

// verificar que el arreglo original no cambió
console.log(JSON.stringify(reparaciones) === JSON.stringify(copiaOriginal));
