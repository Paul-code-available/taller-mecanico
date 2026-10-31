const $ = s => document.querySelector(s);

const money = n => n.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN'
});

const BADGE = {
    'En proceso': 'b-on',
    'En taller': 'b-on',
    'Completada': 'b-ok',
    'Entregado': 'b-ok',
    'Retrasada': 'b-bad'
};

const badge = s => `<span class="badge ${BADGE[s] || ''}">${s}</span>`;

/* Datos de ejemplo (estáticos) */
const O = [
    ['OS-1042', 'Carlos Mendoza', 'Nissan Versa 2019', 'Cambio de frenos', 'Luis Ortega', 'En proceso', '2026-10-29', 2850],
    ['OS-1041', 'Ana Robles', 'Toyota Hilux 2021', 'Afinación mayor', 'Marco Ruiz', 'Completada', '2026-10-28', 3400],
    ['OS-1040', 'Jorge Pineda', 'VW Jetta 2017', 'Diagnóstico eléctrico', 'Luis Ortega', 'Retrasada', '2026-10-24', 1200],
    ['OS-1039', 'Sofía Lara', 'Chevrolet Aveo 2015', 'Cambio de aceite', 'Marco Ruiz', 'Completada', '2026-10-27', 890],
    ['OS-1038', 'Raúl Cota', 'Ford Ranger 2020', 'Suspensión delantera', 'Iván Soto', 'En proceso', '2026-10-30', 5600],
    ['OS-1037', 'Marta Núñez', 'Honda CR-V 2018', 'Revisión de A/C', 'Iván Soto', 'Pendiente', '2026-10-31', 1750],
    ['OS-1036', 'Pedro Gámez', 'Mazda 3 2016', 'Cambio de banda', 'Marco Ruiz', 'Retrasada', '2026-10-22', 2300],
    ['OS-1035', 'Elena Ibarra', 'Kia Rio 2022', 'Alineación y balanceo', 'Luis Ortega', 'Completada', '2026-10-26', 980]
];

const V = [
    ['BCS-421-A', 'Nissan Versa', 2019, 'Carlos Mendoza', 84200, '2026-10-29', 'En taller'],
    ['BCS-118-C', 'Toyota Hilux', 2021, 'Ana Robles', 52100, '2026-10-28', 'Entregado'],
    ['BCS-907-B', 'Volkswagen Jetta', 2017, 'Jorge Pineda', 121500, '2026-10-24', 'En taller'],
    ['BCS-355-D', 'Chevrolet Aveo', 2015, 'Sofía Lara', 156800, '2026-10-27', 'Entregado'],
    ['BCS-642-A', 'Ford Ranger', 2020, 'Raúl Cota', 67300, '2026-10-30', 'En taller'],
    ['BCS-290-E', 'Honda CR-V', 2018, 'Marta Núñez', 98400, '2026-10-31', 'En espera'],
    ['BCS-775-F', 'Mazda 3', 2016, 'Pedro Gámez', 133900, '2026-10-22', 'En taller'],
    ['BCS-503-B', 'Kia Rio', 2022, 'Elena Ibarra', 21700, '2026-10-26', 'Entregado']
];

/* Columnas: [encabezado, render(fila), clase] */
const COLS = {
    ord: [
        ['Folio', r => r[0], 'id'],
        ['Cliente', r => r[1]],
        ['Vehículo', r => r[2]],
        ['Servicio', r => r[3]],
        ['Mecánico', r => r[4]],
        ['Estado', r => badge(r[5])],
        ['Fecha', r => r[6]],
        ['Total', r => money(r[7]), 'r']
    ],

    veh: [
        ['Placa', r => r[0], 'id'],
        ['Vehículo', r => r[1]],
        ['Año', r => r[2]],
        ['Cliente', r => r[3]],
        ['Kilometraje', r => r[4].toLocaleString('es-MX') + ' km', 'r'],
        ['Última visita', r => r[5]],
        ['Estado', r => badge(r[6])]
    ]
};

/* Shell: sidebar + topbar */
const ICON = {
    ordenes: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',

    vehiculos: '<path d="M4 16v-4l2-5h12l2 5v4zM4 16v2M20 16v2M4 12h16"/>',

    mecanicos: '<path d="M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9"/>',

    inventario: '<path d="M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8"/>'
};

const NAV = [
    ['ordenes', 'Órdenes'],
    ['vehiculos', 'Vehículos'],
    ['mecanicos', 'Mecánicos'],
    ['inventario', 'Inventario']
];

const page = document.body.dataset.page;

$('#sidebar').innerHTML = `
    <a class="logo" href="index.html" aria-label="Inicio">
        <b>TM</b>
        <span class="lbl">Taller Mecánico</span>
    </a>

    <nav class="nav" aria-label="Principal">
        ${NAV.map(([k, t]) => {
            const live = k === 'ordenes' || k === 'vehiculos';

            return `
                <a
                    href="../pages/${live ? k + '.html' : '#'}"
                    title="${t}"
                    ${page === k ? 'class="active" aria-current="page"' : ''}
                    ${live ? '' : 'data-soon'}
                >
                    <svg viewBox="0 0 24 24">${ICON[k]}</svg>
                    <span class="lbl">${t}</span>
                </a>
            `;
        }).join('')}
    </nav>
`;

$('#topbar').innerHTML = `
    <div class="search">
        <input
            id="q"
            type="search"
            placeholder="Buscar orden, vehículo, mecánico, pieza, etc..."
            aria-label="Búsqueda global"
        >
    </div>

    <div class="user">
        <button class="theme-btn" id="theme" type="button"></button>

        <div class="lbl">
            Administrador
            <small>Taller Central</small>
        </div>

        <span class="av">AD</span>
    </div>
`;

const root = document.documentElement;

function setTheme(t) {
    root.dataset.theme = t;

    try {
        localStorage.setItem('tema', t);
    } catch (e) {}

    const b = $('#theme');
    const l = t === 'dark'
        ? 'Cambiar a modo claro'
        : 'Cambiar a modo oscuro';

    b.textContent = t === 'dark' ? '☀' : '☾';
    b.title = l;
    b.setAttribute('aria-label', l);
}

setTheme(root.dataset.theme || 'dark');

$('#theme').onclick = () => setTheme(
    root.dataset.theme === 'dark' ? 'light' : 'dark'
);

let tt;

function toast(msg) {
    const t = $('#toast');

    t.textContent = msg;
    t.classList.add('show');

    clearTimeout(tt);

    tt = setTimeout(() => t.classList.remove('show'), 2600);
}

document.querySelectorAll('[data-soon]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        toast('Esta sección no está incluida en esta versión.');
    });
});

/* Tabla con estados: carga, vacío, error. Vista previa: ?estado=error | ?estado=vacio */
function table(host, cols, rows) {
    host.innerHTML = rows.length
        ? `
            <table>
                <thead>
                    <tr>
                        ${cols.map(c => `
                            <th class="${c[2] === 'r' ? 'r' : ''}">${c[0]}</th>
                        `).join('')}
                    </tr>
                </thead>

                <tbody>
                    ${rows.map(r => `
                        <tr>
                            ${cols.map(c => `
                                <td class="${c[2] || ''}">${c[1](r)}</td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `
        : '<div class="state">No hay registros para mostrar. Cambia el filtro o la búsqueda.</div>';
}

function list(host, cols, all, si, chipsEl) {
    const mode = new URLSearchParams(location.search).get('estado');

    let q = '';
    let f = 'Todos';
    let rows = all;

    const draw = () => table(
        host,
        cols,
        rows.filter(r =>
            (f === 'Todos' || r[si] === f) &&
            r.join(' ').toLowerCase().includes(q)
        )
    );

    host.innerHTML = `
        <div class="skl">
            ${'<div class="sk"></div>'.repeat(5)}
        </div>
    `;

    setTimeout(() => {
        if (mode === 'error') {
            host.innerHTML = `
                <div class="state err">
                    <strong>No se pudieron cargar los datos.</strong>
                    <span>Revisa tu conexión e inténtalo de nuevo.</span>
                    <button class="btn" onclick="location.href=location.pathname">
                        Reintentar
                    </button>
                </div>
            `;

            return;
        }

        if (mode === 'vacio') rows = [];

        if (chipsEl) {
            chipsEl.innerHTML = [
                'Todos',
                ...new Set(all.map(r => r[si]))
            ].map(s => `
                <button class="chip${s === f ? ' on' : ''}">${s}</button>
            `).join('');

            chipsEl.onclick = e => {
                if (!e.target.classList.contains('chip')) return;

                f = e.target.textContent;

                chipsEl.querySelectorAll('.chip').forEach(c => {
                    c.classList.toggle('on', c === e.target);
                });

                draw();
            };
        }

        draw();
    }, 650);

    $('#q').addEventListener('input', e => {
        q = e.target.value.toLowerCase().trim();

        if (host.querySelector('table') || host.querySelector('.state:not(.err)')) {
            draw();
        }
    });
}