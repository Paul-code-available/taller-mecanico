const $ = s => document.querySelector(s);

const money = n => n.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN'
});

/* Crea elementos con la API del DOM. Los textos se insertan como nodos de texto
   (nunca como HTML), así que el contenido del usuario no puede inyectar código. */
function el(tag, props = {}, ...hijos) {
    const e = document.createElement(tag);

    for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;

        if (k === 'class') e.className = v;
        else if (k === 'text') e.textContent = v;
        else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v === true ? '' : v);
    }

    e.append(...hijos.flat().filter(h => h != null && h !== false));
    return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function icono(formas) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');

    formas.forEach(([tag, attrs]) => {
        const n = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
        svg.append(n);
    });

    return svg;
}

const BADGE = {
    'En proceso': 'b-on',
    'En taller': 'b-on',
    'Completada': 'b-ok',
    'Entregado': 'b-ok',
    'Retrasada': 'b-bad'
};

const badge = s => el('span', { class: 'badge ' + (BADGE[s] || ''), text: s });

const page = document.body.dataset.page;
const inPages = location.pathname.includes('/pages/');
const BASE = inPages ? '../' : '';

/* ===== Datos: fetch (JSON) + localStorage ===== */
async function cargarJSON(ruta) {
    const res = await fetch(BASE + ruta);

    if (!res.ok) throw new Error(`No se pudo leer ${ruta} (error ${res.status}).`);

    return res.json();
}

const LS = {
    leer(clave, porDefecto = []) {
        try {
            return JSON.parse(localStorage.getItem(clave)) ?? porDefecto;
        } catch (e) {
            return porDefecto;
        }
    },

    guardar(clave, valor) {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
            return true;
        } catch (e) {
            return false;
        }
    }
};

const KEY_ORDENES = 'ordenes_nuevas';

/* Órdenes guardadas por el usuario (primero) + órdenes del JSON */
async function cargarOrdenes() {
    const base = await cargarJSON('data/ordenes.json');
    return [...LS.leer(KEY_ORDENES), ...base];
}

const cargarVehiculos = () => cargarJSON('data/vehiculos.json');

async function guardarOrden(datos) {
    const todas = await cargarOrdenes();
    const ultimo = Math.max(0, ...todas.map(o => parseInt(o.folio.slice(3), 10) || 0));

    const orden = {
        folio: 'OS-' + (ultimo + 1),
        cliente: datos.cliente.trim(),
        vehiculo: datos.vehiculo.trim(),
        servicio: datos.servicio,
        mecanico: datos.mecanico,
        estado: datos.estado,
        fecha: datos.fecha,
        total: Number(datos.total)
    };

    if (!LS.guardar(KEY_ORDENES, [orden, ...LS.leer(KEY_ORDENES)])) {
        throw new Error('El navegador no permitió guardar los datos.');
    }

    return orden;
}

/* Columnas: [encabezado, render(fila) -> texto o nodo, clase] */
const COLS = {
    ord: [
        ['Folio', r => r.folio, 'id'],
        ['Cliente', r => r.cliente],
        ['Vehículo', r => r.vehiculo],
        ['Servicio', r => r.servicio],
        ['Mecánico', r => r.mecanico],
        ['Estado', r => badge(r.estado)],
        ['Fecha', r => r.fecha],
        ['Total', r => money(r.total), 'r']
    ],

    veh: [
        ['Placa', r => r.placa, 'id'],
        ['Vehículo', r => r.vehiculo],
        ['Año', r => r.anio],
        ['Cliente', r => r.cliente],
        ['Kilometraje', r => r.km.toLocaleString('es-MX') + ' km', 'r'],
        ['Última visita', r => r.ultimaVisita],
        ['Estado', r => badge(r.estado)]
    ]
};

/* Shell: sidebar + topbar */
const ICON = {
    inicio: [['path', { d: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10' }]],

    ordenes: [
        ['rect', { x: 5, y: 4, width: 14, height: 17, rx: 2 }],
        ['path', { d: 'M9 4h6v3H9zM9 12h6M9 16h4' }]
    ],

    vehiculos: [['path', { d: 'M4 16v-4l2-5h12l2 5v4zM4 16v2M20 16v2M4 12h16' }]],

    mecanicos: [['path', { d: 'M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9' }]],

    inventario: [['path', { d: 'M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8' }]]
};

const NAV = [
    ['inicio', 'Inicio'],
    ['ordenes', 'Órdenes'],
    ['vehiculos', 'Vehículos'],
    ['mecanicos', 'Mecánicos'],
    ['inventario', 'Inventario']
];

const HREF_INICIO = inPages ? '../index.html' : 'index.html';

$('#sidebar').replaceChildren(
    el('a', { class: 'logo', href: HREF_INICIO, 'aria-label': 'Inicio' },
        el('b', { text: 'TM' }),
        el('span', { class: 'lbl', text: 'Taller Mecánico' })
    ),

    el('nav', { class: 'nav', 'aria-label': 'Principal' },
        NAV.map(([k, t]) => {
            const live = k === 'inicio' || k === 'ordenes' || k === 'vehiculos';
            const href = k === 'inicio' ? HREF_INICIO : (inPages ? '' : 'pages/') + k + '.html';

            return el('a', {
                href: live ? href : '#',
                title: t,
                class: page === k ? 'active' : null,
                'aria-current': page === k ? 'page' : null,
                'data-soon': !live
            },
                icono(ICON[k] || []),
                el('span', { class: 'lbl', text: t })
            );
        })
    )
);

$('#topbar').replaceChildren(
    el('div', { class: 'search' },
        el('input', {
            id: 'q',
            type: 'search',
            placeholder: 'Buscar orden, vehículo, mecánico, pieza, etc...',
            'aria-label': 'Búsqueda global'
        })
    ),

    el('div', { class: 'user' },
        el('button', { class: 'theme-btn', id: 'theme', type: 'button' }),
        el('div', { class: 'lbl' }, 'Administrador', el('small', { text: 'Taller Central' })),
        el('span', { class: 'av', text: 'AD' })
    )
);

const root = document.documentElement;

/* Tema: se guarda solo cuando el usuario lo elige; si no ha elegido, sigue al sistema */
const TEMA_KEY = 'tema';
const prefiereClaro = matchMedia('(prefers-color-scheme: light)');

function aplicarTema(t) {
    root.dataset.theme = t;

    const b = $('#theme');
    const l = t === 'dark'
        ? 'Cambiar a modo claro'
        : 'Cambiar a modo oscuro';

    b.textContent = t === 'dark' ? '☀' : '☾';
    b.title = l;
    b.setAttribute('aria-label', l);
}

function elegirTema(t) {
    aplicarTema(t);

    try {
        localStorage.setItem(TEMA_KEY, t);
    } catch (e) {}
}

const hayTemaGuardado = () => {
    try {
        return ['light', 'dark'].includes(localStorage.getItem(TEMA_KEY));
    } catch (e) {
        return false;
    }
};

// Tema inicial (ya lo definió el script del <head>); aquí solo se sincroniza el botón
aplicarTema(root.dataset.theme || 'dark');

$('#theme').onclick = () => elegirTema(
    root.dataset.theme === 'dark' ? 'light' : 'dark'
);

// Si el usuario no ha elegido, se sigue el cambio del sistema operativo
prefiereClaro.addEventListener('change', e => {
    if (!hayTemaGuardado()) aplicarTema(e.matches ? 'light' : 'dark');
});

// Si lo cambia en otra pestaña, esta se actualiza
addEventListener('storage', e => {
    if (e.key === TEMA_KEY && ['light', 'dark'].includes(e.newValue)) aplicarTema(e.newValue);
});

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

/* SweetAlert2 con los colores del tema actual */
function swalTema() {
    const css = getComputedStyle(root);
    const v = n => css.getPropertyValue(n).trim();

    return {
        background: v('--card'),
        color: v('--text'),
        confirmButtonColor: v('--cyan'),
        cancelButtonColor: v('--line')
    };
}

/* Tabla con estados: carga, error (con reintento) y vacío.
   Vista previa: ?estado=error | ?estado=vacio */
function table(host, cols, rows) {
    if (!rows.length) {
        host.replaceChildren(el('div', {
            class: 'state',
            text: 'No hay registros para mostrar. Cambia el filtro o la búsqueda.'
        }));
        return;
    }

    host.replaceChildren(el('table', {},
        el('thead', {},
            el('tr', {}, cols.map(c => el('th', { class: c[2] === 'r' ? 'r' : null, text: c[0] })))
        ),
        el('tbody', {},
            rows.map(r => el('tr', {}, cols.map(c => el('td', { class: c[2] || null }, c[1](r)))))
        )
    ));
}

/* fuente: función async que devuelve las filas. Devuelve { recargar }. */
function list(host, cols, fuente, key, chipsEl) {
    const mode = new URLSearchParams(location.search).get('estado');

    let q = '';
    let f = 'Todos';
    let rows = [];
    let listo = false;

    const draw = () => table(
        host,
        cols,
        rows.filter(r =>
            (f === 'Todos' || r[key] === f) &&
            Object.values(r).join(' ').toLowerCase().includes(q)
        )
    );

    async function cargar() {
        listo = false;

        host.replaceChildren(
            el('div', { class: 'skl', role: 'status', 'aria-live': 'polite' },
                el('span', { style: 'color:var(--muted)', text: 'Cargando datos…' }),
                Array.from({ length: 4 }, () => el('div', { class: 'sk' }))
            )
        );

        try {
            if (mode === 'error') throw new Error('Error simulado (?estado=error).');

            rows = mode === 'vacio' ? [] : await fuente();

        } catch (err) {
            const msg = err instanceof TypeError
                ? 'No hay conexión con el servidor.'
                : err instanceof SyntaxError
                    ? 'El archivo de datos no tiene un formato válido.'
                    : err.message;

            host.replaceChildren(
                el('div', { class: 'state err' },
                    el('strong', { text: 'No se pudieron cargar los datos.' }),
                    el('span', { text: msg }),
                    el('button', { class: 'btn', type: 'button', text: 'Reintentar', onclick: cargar })
                )
            );

            if (window.Swal) {
                Swal.fire({
                    ...swalTema(),
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'No se pudieron cargar los datos',
                    showConfirmButton: false,
                    timer: 3500
                });
            }

            return;
        }

        if (chipsEl) {
            chipsEl.replaceChildren(
                ...['Todos', ...new Set(rows.map(r => r[key]))].map(s =>
                    el('button', { class: 'chip' + (s === f ? ' on' : ''), type: 'button', text: s })
                )
            );

            chipsEl.onclick = e => {
                if (!e.target.classList.contains('chip')) return;

                f = e.target.textContent;

                chipsEl.querySelectorAll('.chip').forEach(c => {
                    c.classList.toggle('on', c === e.target);
                });

                draw();
            };
        }

        listo = true;
        draw();
    }

    $('#q').addEventListener('input', e => {
        q = e.target.value.toLowerCase().trim();

        if (listo) draw();
    });

    cargar();

    return { recargar: cargar };
}