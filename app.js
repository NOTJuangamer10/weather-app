// Weather App Beta 2
// llama a la API de OpenWeatherMap para sacar el clima de una ciudad
// y pone un GIF fijo de fondo segun el tipo de clima

// === PON AQUI TU API KEY DE OPENWEATHERMAP ===
// la sacas gratis en https://openweathermap.org/api
var API_KEY = 'c080b323e9d172f81ba7593f715826d5';
// ============================================


// GIFs fijos de Giphy para cada tipo de clima
// los busque a mano en giphy.com y cogi los que mejor representaban cada uno
// asi siempre sale el mismo y se siente como mirar al cielo
var GIFS_CLIMA = {
    tormenta: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGtvbXRmOWxuMHQ0dHg0dzVmNmZubGJ4dHoyN3c1MXlpcWl5azk0NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hWvk9iUU4uBBeyBq0k/giphy.gif',
    llovizna: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjY2Z2w3MGQ2eXEwZWpwZG1iMGM3enR0NTljNXdzcnlhcDYwZm1hdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lSzQjkthGS1gc/giphy.gif',
    lluvia: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjRvcmZsZG80eWw4am81NGs5b2x6bGx3MXh2ODhoZW8wNTJhdXoxZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Mgq7EMQUrhcvC/giphy.gif',
    nieve: 'https://media.giphy.com/media/6YNgoTEPs6vZe/giphy.gif',
    niebla: 'https://media.giphy.com/media/McDhCoTyRyLiE/giphy.gif',
    claro: 'https://media.giphy.com/media/4yO9e7ZZ3VfV8FiihO/giphy.gif',
    pocoNuboso: 'https://media.giphy.com/media/HgycnYQCMeJXO/giphy.gif',
    nubes: 'https://media.giphy.com/media/l0HlxmJJbxo1Uq8QU/giphy.gif',
    muyNuboso: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExazB2YmtnY3I3ZWtrOGdjc3J4OXY3MDRxYXVyNzYzaXIxeHd4cjR4bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gk3s6G7AdUNkey0YpE/giphy.gif'
};


// mapeo los codigos de OpenWeatherMap a un icono y un tipo de GIF
// los codigos van por grupos:
// 2xx = tormenta, 3xx = llovizna, 5xx = lluvia, 6xx = nieve,
// 7xx = niebla, 800 = claro, 80x = nubes
function infoClima(codigo) {
    if (codigo >= 200 && codigo < 300) return { icono: '\u26A1', tipo: 'tormenta' };
    if (codigo >= 300 && codigo < 500) return { icono: '\u2614', tipo: 'llovizna' };
    if (codigo >= 500 && codigo < 600) return { icono: '\u2614', tipo: 'lluvia' };
    if (codigo >= 600 && codigo < 700) return { icono: '\u2744', tipo: 'nieve' };
    if (codigo >= 700 && codigo < 800) return { icono: '~', tipo: 'niebla' };
    if (codigo === 800) return { icono: '\u2600', tipo: 'claro' };
    if (codigo === 801) return { icono: '\u26C5', tipo: 'pocoNuboso' };
    if (codigo === 802) return { icono: '\u2601', tipo: 'nubes' };
    return { icono: '\u2601', tipo: 'muyNuboso' };
}


// pillar los elementos del HTML
var formulario = document.getElementById('form-clima');
var inputCiudad = document.getElementById('input-ciudad');
var cargando = document.getElementById('cargando');
var error = document.getElementById('error');
var resultado = document.getElementById('resultado');
var ciudad = document.getElementById('ciudad');
var icono = document.getElementById('icono-clima');
var temp = document.getElementById('temp');
var descripcion = document.getElementById('descripcion');
var detalles = document.getElementById('detalles');

// cuando envio el formulario busco el clima
formulario.addEventListener('submit', function (e) {
    e.preventDefault();
    var ciudadBuscada = inputCiudad.value.trim();
    if (ciudadBuscada === '') {
        return;
    }
    buscarClima(ciudadBuscada);
});

// llamo a la API de OpenWeatherMap
function buscarClima(ciudadBuscada) {
    cargando.style.display = 'block';
    error.style.display = 'none';
    resultado.style.display = 'none';

    var url = 'https://api.openweathermap.org/data/2.5/weather?q='
        + encodeURIComponent(ciudadBuscada)
        + '&appid=' + API_KEY + '&units=metric&lang=es';

    fetch(url)
        .then(function (res) {
            if (!res.ok) {
                throw new Error('no encontrada');
            }
            return res.json();
        })
        .then(function (datos) {
            mostrarClima(datos);
        })
        .catch(function (err) {
            mostrarError('No se encontro la ciudad. Prueba con otra.');
        })
        .finally(function () {
            cargando.style.display = 'none';
        });
}

// pongo el GIF de fondo segun el tipo de clima
function ponerGifFondo(tipo) {
    var url = GIFS_CLIMA[tipo];
    if (url) {
        document.body.style.backgroundImage = 'url("' + url + '")';
    }
}

// pinto el clima en el HTML
function mostrarClima(datos) {
    ciudad.textContent = datos.name + ', ' + datos.sys.country;

    // saco el icono y el tipo de GIF segun el codigo del clima
    var info = infoClima(datos.weather[0].id);
    icono.textContent = info.icono;
    ponerGifFondo(info.tipo);

    temp.textContent = Math.round(datos.main.temp) + '\u00B0C';
    descripcion.textContent = datos.weather[0].description;
    detalles.innerHTML = '';

    // humedad, viento, sensacion termica
    detalles.appendChild(crearDetalle('Humedad', datos.main.humidity + '%'));
    detalles.appendChild(crearDetalle('Viento', datos.wind.speed + ' km/h'));
    detalles.appendChild(crearDetalle('Sensacion', Math.round(datos.main.feels_like) + '\u00B0C'));

    resultado.style.display = 'block';
}

// creo una caja de detalle con label y valor
function crearDetalle(label, valor) {
    var div = document.createElement('div');
    div.className = 'detalle';
    var lab = document.createElement('div');
    lab.className = 'label';
    lab.textContent = label;
    var val = document.createElement('div');
    val.className = 'valor';
    val.textContent = valor;
    div.appendChild(lab);
    div.appendChild(val);
    return div;
}

// muestro un mensaje de error
function mostrarError(mensaje) {
    error.textContent = mensaje;
    error.style.display = 'block';
}



// === BETA 3: pronostico 5 dias + grafico de temperaturas ===
// añado una seccion debajo del resultado con el pronostico de 5 dias
// y un grafico de temperaturas max/min dibujado en un canvas


// creo la seccion del pronostico y la meto despues del resultado
var seccionPronostico = document.createElement('section');
seccionPronostico.id = 'pronostico';
seccionPronostico.innerHTML =
    '<h2>Pronostico 5 dias</h2>' +
    '<div id="lista-dias"></div>' +
    '<canvas id="grafico" width="560" height="200"></canvas>' +
    '<p id="grafico-leyenda"><span class="punto-max"></span> maximas &nbsp;&nbsp; <span class="punto-min"></span> minimas</p>';
// la meto despues de #resultado
resultado.parentNode.insertBefore(seccionPronostico, resultado.nextSibling);

// pillar la lista y el canvas
var listaDias = document.getElementById('lista-dias');
var canvas = document.getElementById('grafico');
var ctx = canvas.getContext('2d');

// guardo la funcion mostrarClima vieja para no pisarla
var mostrarClimaViejo = mostrarClima;

mostrarClima = function (datos) {
    mostrarClimaViejo(datos);
    buscarPronostico(datos.name);
};

// llamo a la API de forecast de OpenWeatherMap
// devuelve datos cada 3 horas (40 puntos en 5 dias)
function buscarPronostico(ciudadBuscada) {
    var url = 'https://api.openweathermap.org/data/2.5/forecast?q='
        + encodeURIComponent(ciudadBuscada)
        + '&appid=' + API_KEY + '&units=metric&lang=es';

    fetch(url)
        .then(function (res) {
            if (!res.ok) {
                throw new Error('no encontrado');
            }
            return res.json();
        })
        .then(function (datos) {
            var dias = procesarDias(datos.list);
            mostrarPronostico(dias);
            dibujarGrafico(dias);
            seccionPronostico.style.display = 'block';
        })
        .catch(function (err) {
            // si falla el pronostico no pasa nada, el clima actual sigue
            seccionPronostico.style.display = 'none';
        });
}

// proceso los datos: la API da 1 punto cada 3h, yo quiero 1 por dia
// para cada dia saco la temp maxima y minima
function procesarDias(lista) {
    var diasVistos = {};

    lista.forEach(function (punto) {
        var fecha = new Date(punto.dt * 1000);
        var diaKey = fecha.toDateString();

        if (!diasVistos[diaKey]) {
            diasVistos[diaKey] = {
                fecha: fecha,
                icono: punto.weather[0].id,
                tempMax: punto.main.temp_max,
                tempMin: punto.main.temp_min
            };
        } else {
            var d = diasVistos[diaKey];
            if (punto.main.temp_max > d.tempMax) {
                d.tempMax = punto.main.temp_max;
            }
            if (punto.main.temp_min < d.tempMin) {
                d.tempMin = punto.main.temp_min;
            }
        }
    });

    var dias = [];
    Object.keys(diasVistos).forEach(function (key) {
        dias.push(diasVistos[key]);
    });
    return dias.slice(0, 5);
}

// muestro los 5 dias como tarjetitas
function mostrarPronostico(dias) {
    listaDias.innerHTML = '';
    var nombresDias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

    dias.forEach(function (dia) {
        var div = document.createElement('div');
        div.className = 'dia-pronostico';

        var nombre = document.createElement('div');
        nombre.className = 'dia-nombre';
        nombre.textContent = nombresDias[dia.fecha.getDay()];

        var icono = document.createElement('div');
        icono.className = 'dia-icono';
        icono.textContent = infoClima(dia.icono).icono;

        var temps = document.createElement('div');
        temps.className = 'dia-temps';
        var max = document.createElement('span');
        max.className = 'temp-max';
        max.textContent = Math.round(dia.tempMax) + '\u00B0';
        var min = document.createElement('span');
        min.className = 'temp-min';
        min.textContent = Math.round(dia.tempMin) + '\u00B0';
        temps.appendChild(max);
        temps.appendChild(min);

        div.appendChild(nombre);
        div.appendChild(icono);
        div.appendChild(temps);
        listaDias.appendChild(div);
    });
}

// dibujo el grafico de temperaturas en el canvas
// una linea roja para las maximas y una azul para las minimas
function dibujarGrafico(dias) {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    if (dias.length === 0) {
        return;
    }

    // busco la temp maxima y minima global para escalar el grafico
    var maxGlobal = -Infinity;
    var minGlobal = Infinity;
    dias.forEach(function (d) {
        if (d.tempMax > maxGlobal) {
            maxGlobal = d.tempMax;
        }
        if (d.tempMin < minGlobal) {
            minGlobal = d.tempMin;
        }
    });

    // margenes del grafico
    var margenY = 20;
    var margenX = 30;
    var rango = (maxGlobal - minGlobal) || 1;
    var nombresDias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

    // calculo las coordenadas de cada punto
    var puntosMax = [];
    var puntosMin = [];
    dias.forEach(function (d, i) {
        var x = margenX + (i * (w - 2 * margenX)) / Math.max(dias.length - 1, 1);
        var yMax = h - margenY - ((d.tempMax - minGlobal) / rango) * (h - 2 * margenY);
        var yMin = h - margenY - ((d.tempMin - minGlobal) / rango) * (h - 2 * margenY);
        puntosMax.push({ x: x, y: yMax });
        puntosMin.push({ x: x, y: yMin });
    });

    // dibujo la linea de maximas (rojo)
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    puntosMax.forEach(function (p, i) {
        if (i === 0) {
            ctx.moveTo(p.x, p.y);
        } else {
            ctx.lineTo(p.x, p.y);
        }
    });
    ctx.stroke();

    // dibujo la linea de minimas (azul claro)
    ctx.strokeStyle = '#74c0fc';
    ctx.beginPath();
    puntosMin.forEach(function (p, i) {
        if (i === 0) {
            ctx.moveTo(p.x, p.y);
        } else {
            ctx.lineTo(p.x, p.y);
        }
    });
    ctx.stroke();

    // dibujo los puntos como circulitos
    puntosMax.forEach(function (p) {
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    puntosMin.forEach(function (p) {
        ctx.fillStyle = '#74c0fc';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });

    // etiquetas de los dias abajo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    dias.forEach(function (d, i) {
        var x = margenX + (i * (w - 2 * margenX)) / Math.max(dias.length - 1, 1);
        ctx.fillText(nombresDias[d.fecha.getDay()], x, h - 6);
    });
}



// === BETA 4: geolocalizacion, favoritos y PWA ===
// añado un boton para usar tu ubicacion, un sistema de favoritos
// y registro el service worker para que la app sea instalable


// --- FAVORITOS ---
// los guardo en localStorage como una lista de nombres de ciudades
var CLAVE_FAVORITOS = 'weather_app_favoritos';

function cargarFavoritos() {
    var datos = localStorage.getItem(CLAVE_FAVORITOS);
    if (datos === null) {
        return [];
    }
    try {
        return JSON.parse(datos);
    } catch (e) {
        return [];
    }
}

function guardarFavoritos(lista) {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(lista));
}

// creo la seccion de favoritos y la meto debajo del buscador
var seccionFavoritos = document.createElement('div');
seccionFavoritos.id = 'favoritos';
var seccionBusqueda = document.getElementById('busqueda');
seccionBusqueda.appendChild(seccionFavoritos);

// pinto los favoritos como chips clicables
function mostrarFavoritos() {
    var favoritos = cargarFavoritos();
    seccionFavoritos.innerHTML = '';

    if (favoritos.length === 0) {
        return;
    }

    var titulo = document.createElement('div');
    titulo.id = 'favoritos-titulo';
    titulo.textContent = 'Favoritos';
    seccionFavoritos.appendChild(titulo);

    var lista = document.createElement('div');
    lista.id = 'favoritos-lista';

    favoritos.forEach(function (ciudad) {
        var chip = document.createElement('span');
        chip.className = 'chip-favorito';
        chip.textContent = ciudad;

        var cruz = document.createElement('span');
        cruz.className = 'chip-cruz';
        cruz.textContent = ' \u00D7';
        cruz.onclick = function (e) {
            e.stopPropagation();
            quitarFavorito(ciudad);
        };

        chip.appendChild(cruz);
        chip.onclick = function () {
            inputCiudad.value = ciudad;
            buscarClima(ciudad);
        };
        lista.appendChild(chip);
    });

    seccionFavoritos.appendChild(lista);
}

function esFavorito(ciudad) {
    var favoritos = cargarFavoritos();
    return favoritos.indexOf(ciudad) !== -1;
}

function anadirFavorito(ciudad) {
    var favoritos = cargarFavoritos();
    if (favoritos.indexOf(ciudad) === -1) {
        favoritos.push(ciudad);
        guardarFavoritos(favoritos);
    }
    mostrarFavoritos();
    actualizarEstrella(ciudad);
}

function quitarFavorito(ciudad) {
    var favoritos = cargarFavoritos();
    var nuevos = favoritos.filter(function (c) { return c !== ciudad; });
    guardarFavoritos(nuevos);
    mostrarFavoritos();
    actualizarEstrella(ciudad);
}

// creo el boton estrella y lo meto al lado del nombre de la ciudad
var estrella = document.createElement('span');
estrella.id = 'estrella-favorito';
estrella.title = 'Añadir a favoritos';
// lo inserto despues del h2 de la ciudad
ciudad.parentNode.insertBefore(estrella, ciudad.nextSibling);

estrella.onclick = function () {
    var nombreCiudad = ciudad.textContent.split(',')[0];
    if (esFavorito(nombreCiudad)) {
        quitarFavorito(nombreCiudad);
    } else {
        anadirFavorito(nombreCiudad);
    }
};

function actualizarEstrella(ciudadNombre) {
    if (esFavorito(ciudadNombre)) {
        estrella.textContent = '\u2605';
        estrella.classList.add('activa');
    } else {
        estrella.textContent = '\u2606';
        estrella.classList.remove('activa');
    }
}


// --- GEOLOCALIZACION ---
// añado un boton "usar mi ubicacion" al lado del formulario
var btnUbicacion = document.createElement('button');
btnUbicacion.type = 'button';
btnUbicacion.id = 'btn-ubicacion';
btnUbicacion.textContent = 'Mi ubicacion';
// lo meto dentro del formulario, despues del boton Buscar
formulario.appendChild(btnUbicacion);

btnUbicacion.onclick = function () {
    if (!navigator.geolocation) {
        mostrarError('Tu navegador no soporta geolocalizacion.');
        return;
    }

    cargando.style.display = 'block';
    cargando.textContent = 'detectando ubicacion...';
    error.style.display = 'none';
    resultado.style.display = 'none';

    navigator.geolocation.getCurrentPosition(
        function (pos) {
            // busco el clima por coordenadas en vez de por nombre
            var lat = pos.coords.latitude;
            var lon = pos.coords.longitude;
            buscarClimaPorCoords(lat, lon);
        },
        function (err) {
            cargando.style.display = 'none';
            cargando.textContent = 'buscando...';
            mostrarError('No se pudo obtener tu ubicacion. Revisa los permisos.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
};

// llamo a la API usando lat/lon en vez del nombre de la ciudad
function buscarClimaPorCoords(lat, lon) {
    var url = 'https://api.openweathermap.org/data/2.5/weather?lat='
        + lat + '&lon=' + lon + '&appid=' + API_KEY + '&units=metric&lang=es';

    fetch(url)
        .then(function (res) {
            if (!res.ok) {
                throw new Error('no encontrada');
            }
            return res.json();
        })
        .then(function (datos) {
            cargando.textContent = 'buscando...';
            mostrarClima(datos);
        })
        .catch(function (err) {
            cargando.textContent = 'buscando...';
            mostrarError('No se pudo obtener el clima de tu ubicacion.');
        })
        .finally(function () {
            cargando.style.display = 'none';
        });
}


// --- EXTENDER mostrarClima para actualizar la estrella ---
// uso el mismo patron de funcion expression para evitar el bug de hoisting
var mostrarClimaBeta3 = mostrarClima;
mostrarClima = function (datos) {
    mostrarClimaBeta3(datos);
    // actualizo el estado de la estrella segun si la ciudad es favorito
    var nombreCiudad = datos.name;
    actualizarEstrella(nombreCiudad);
};


// --- PWA: registrar el service worker ---
// hace que la app sea instalable y funcione offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        this.navigator.serviceWorker.register('sw.js').then(
            function (reg) {
                console.log('Service worker registrado.');
            },
            function (err) {
                console.log('Error al registrar el service worker:', err);
            }
        );
    });
}


// pinto los favoritos al cargar la pagina
mostrarFavoritos();


// --- BETA 4: cambiar font a Space Grotesk ---
// lo cargo desde Google Fonts añadiendo un <link> al <head>
// (no puedo usar @import en CSS porque va al final del archivo y
//  CSS exige que @import vaya antes que cualquier otra regla)
var linkFuente = document.createElement('link');
linkFuente.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap';
linkFuente.rel = 'stylesheet';
document.head.appendChild(linkFuente);



// === WEATHER APP PATCH: settings + i18n + unidades + welcome ===
// Añade:
// 1. Botón de ajustes (engranaje) en el header
// 2. Panel de settings: idioma (ES/EN) y unidades (°C/°F)
// 3. Traducciones ES/EN con data-i18n
// 4. Conversión de unidades al vuelo
// 5. Estado de bienvenida más cuidadito cuando no hay búsqueda


// --- preferencias guardadas ---
var PREFS_KEY = 'weather_app_prefs';

function cargarPrefs() {
    var datos = localStorage.getItem(PREFS_KEY);
    if (!datos) return { idioma: 'es', unidades: 'C' };
    try { return JSON.parse(datos); } catch (e) { return { idioma: 'es', unidades: 'C' }; }
}

function guardarPrefs(prefs) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

var prefs = cargarPrefs();


// --- traducciones ---
var TRADUCCIONES = {
    es: {
        titulo: 'Weather App',
        subtitulo: 'beta 4 - busca el clima de cualquier ciudad',
        placeholder: 'escribe una ciudad...',
        buscar: 'Buscar',
        miUbicacion: 'Mi ubicacion',
        humedad: 'Humedad',
        viento: 'Viento',
        sensacion: 'Sensacion',
        buscando: 'buscando...',
        detectando: 'detectando ubicacion...',
        noEncontrada: 'No se encontro la ciudad. Prueba con otra.',
        noUbicacion: 'No se pudo obtener tu ubicacion. Revisa los permisos.',
        favoritos: 'Favoritos',
        pronostico: 'Pronostico 5 dias',
        maximas: 'maximas',
        minimas: 'minimas',
        settings: 'Ajustes',
        idioma: 'Idioma',
        unidades: 'Unidades',
        cerrar: 'Cerrar',
        bienvenidaTitulo: 'Busca el clima',
        bienvenidaDesc: 'escribe una ciudad o usa tu ubicacion para empezar',
        dias: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    },
    en: {
        titulo: 'Weather App',
        subtitulo: 'beta 4 - search the weather of any city',
        placeholder: 'type a city...',
        buscar: 'Search',
        miUbicacion: 'My location',
        humedad: 'Humidity',
        viento: 'Wind',
        sensacion: 'Feels like',
        buscando: 'searching...',
        detectando: 'detecting location...',
        noEncontrada: 'City not found. Try another one.',
        noUbicacion: 'Could not get your location. Check permissions.',
        favoritos: 'Favorites',
        pronostico: '5-day forecast',
        maximas: 'highs',
        minimas: 'lows',
        settings: 'Settings',
        idioma: 'Language',
        unidades: 'Units',
        cerrar: 'Close',
        bienvenidaTitulo: 'Search the weather',
        bienvenidaDesc: 'type a city or use your location to start',
        dias: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
};

function t(key) {
    var trad = TRADUCCIONES[prefs.idioma] || TRADUCCIONES.es;
    return trad[key] || key;
}


// --- conversión de unidades ---
function convertirTemp(celsius) {
    if (prefs.unidades === 'F') {
        return Math.round(celsius * 9 / 5 + 32) + '\u00B0F';
    }
    return Math.round(celsius) + '\u00B0C';
}

function convertirVelocidad(kmh) {
    if (prefs.unidades === 'F') {
        // mph
        return Math.round(kmh * 0.621371) + ' mph';
    }
    return Math.round(kmh) + ' km/h';
}


// --- aplicar traducciones al DOM ---
function aplicarIdioma() {
    // traducir elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    // traducir placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
}


// --- crear el botón de settings y el panel ---
var headerEl = document.querySelector('header');
var btnSettings = document.createElement('button');
btnSettings.type = 'button';
btnSettings.id = 'btn-settings';
btnSettings.innerHTML = '\u2699';  // símbolo engranaje
btnSettings.title = 'Settings';
headerEl.appendChild(btnSettings);

var panelSettings = document.createElement('div');
panelSettings.id = 'panel-settings';
panelSettings.style.display = 'none';
panelSettings.innerHTML =
    '<div class="settings-fila">' +
    '<span data-i18n="idioma">Idioma</span>' +
    '<div class="settings-toggle">' +
    '<button data-lang="es" class="' + (prefs.idioma === 'es' ? 'active' : '') + '">ES</button>' +
    '<button data-lang="en" class="' + (prefs.idioma === 'en' ? 'active' : '') + '">EN</button>' +
    '</div>' +
    '</div>' +
    '<div class="settings-fila">' +
    '<span data-i18n="unidades">Unidades</span>' +
    '<div class="settings-toggle">' +
    '<button data-unit="C" class="' + (prefs.unidades === 'C' ? 'active' : '') + '">\u00B0C</button>' +
    '<button data-unit="F" class="' + (prefs.unidades === 'F' ? 'active' : '') + '">\u00B0F</button>' +
    '</div>' +
    '</div>';
document.body.appendChild(panelSettings);

// toggle del panel
btnSettings.addEventListener('click', function () {
    panelSettings.style.display = panelSettings.style.display === 'none' ? 'block' : 'none';
});

// cerrar al clickar fuera
document.addEventListener('click', function (e) {
    if (!panelSettings.contains(e.target) && e.target !== btnSettings) {
        panelSettings.style.display = 'none';
    }
});

// cambiar idioma
panelSettings.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
        prefs.idioma = btn.getAttribute('data-lang');
        guardarPrefs(prefs);
        panelSettings.querySelectorAll('[data-lang]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        aplicarIdioma();
        // re-renderizar el clima si ya hay resultado
        if (resultado.style.display === 'block') {
            // re-buscar la ultima ciudad
            var ultimaCiudad = ciudad.textContent.split(',')[0];
            buscarClima(ultimaCiudad);
        }
    });
});

// cambiar unidades
panelSettings.querySelectorAll('[data-unit]').forEach(function (btn) {
    btn.addEventListener('click', function () {
        prefs.unidades = btn.getAttribute('data-unit');
        guardarPrefs(prefs);
        panelSettings.querySelectorAll('[data-unit]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        // re-renderizar si hay resultado
        if (resultado.style.display === 'block') {
            var ultimaCiudad = ciudad.textContent.split(',')[0];
            buscarClima(ultimaCiudad);
        }
    });
});


// --- mejorar el estado de bienvenida ---
// añadir data-i18n a los elementos existentes para poder traducirlos
var h1El = document.querySelector('header h1');
var pEl = document.querySelector('header p');
var inputEl = document.getElementById('input-ciudad');
var btnBuscar = document.querySelector('form button[type=submit]');
var btnUbicacion = document.getElementById('btn-ubicacion');

if (h1El) h1El.setAttribute('data-i18n', 'titulo');
if (pEl) pEl.setAttribute('data-i18n', 'subtitulo');
if (inputEl) inputEl.setAttribute('data-i18n-placeholder', 'placeholder');
if (btnBuscar) btnBuscar.setAttribute('data-i18n', 'buscar');
if (btnUbicacion) btnUbicacion.setAttribute('data-i18n', 'miUbicacion');

// crear el mensaje de bienvenida si no existe
var welcomeEl = document.createElement('div');
welcomeEl.id = 'welcome-state';
welcomeEl.innerHTML =
    '<div class="welcome-icon">\u2600</div>' +
    '<h2 data-i18n="bienvenidaTitulo">Busca el clima</h2>' +
    '<p data-i18n="bienvenidaDesc">escribe una ciudad o usa tu ubicacion para empezar</p>';
// lo meto dentro de la sección de búsqueda, después del form
var seccionBusqueda = document.getElementById('busqueda');
if (seccionBusqueda) {
    seccionBusqueda.appendChild(welcomeEl);
}


// --- redefinir mostrarClima para usar unidades convertidas ---
// guardo la funcion vieja (que ya incluye la Beta 3 con favoritos)
var mostrarClimaSettingsViejo = mostrarClima;
mostrarClima = function (datos) {
    // llamo a la funcion vieja para que haga todo lo de antes (gif, favoritos, etc)
    mostrarClimaSettingsViejo(datos);

    // ahora sobreescribo las temperaturas con la unidad correcta
    var tempEl = document.getElementById('temp');
    if (tempEl && datos.main) {
        tempEl.textContent = convertirTemp(datos.main.temp);
    }

    // sensacion termica
    var detalles = document.getElementById('detalles');
    if (detalles && datos.main && datos.wind) {
        // reconstruyo los detalles con las unidades correctas
        detalles.innerHTML = '';
        detalles.appendChild(crearDetalleLang('humedad', datos.main.humidity + '%'));
        detalles.appendChild(crearDetalleLang('viento', convertirVelocidad(datos.wind.speed)));
        detalles.appendChild(crearDetalleLang('sensacion', convertirTemp(datos.main.feels_like)));
    }

    // ocultar el welcome state
    if (welcomeEl) welcomeEl.style.display = 'none';
};

// helper que crea un detalle con label traducido
function crearDetalleLang(labelKey, valor) {
    var div = document.createElement('div');
    div.className = 'detalle';
    var lab = document.createElement('div');
    lab.className = 'label';
    lab.textContent = t(labelKey);
    lab.setAttribute('data-i18n', labelKey);
    var val = document.createElement('div');
    val.className = 'valor';
    val.textContent = valor;
    div.appendChild(lab);
    div.appendChild(val);
    return div;
}


// --- redefinir mostrarError para traducir ---
var mostrarErrorViejo = mostrarError;
mostrarError = function (mensaje) {
    // si el mensaje es uno de los conocidos, traducirlo
    var traduccion = mensaje;
    if (mensaje.indexOf('No se encontro') !== -1 || mensaje.indexOf('not found') !== -1) {
        traduccion = t('noEncontrada');
    } else if (mensaje.indexOf('ubicacion') !== -1 || mensaje.indexOf('location') !== -1) {
        traduccion = t('noUbicacion');
    }
    mostrarErrorViejo(traduccion);
    // ocultar welcome al haber error (ya hay algo buscando)
    if (welcomeEl) welcomeEl.style.display = 'none';
};


// --- redefinir buscarClima para traducir "buscando..." ---
var buscarClimaViejo = buscarClima;
buscarClima = function (ciudadBuscada) {
    // traducir el mensaje de cargando
    cargando.textContent = t('buscando');
    buscarClimaViejo(ciudadBuscada);
};


// --- aplicar idioma al cargar ---
aplicarIdioma();

// mostrar welcome state al inicio (si no hay resultado)
if (resultado.style.display !== 'block' && welcomeEl) {
    welcomeEl.style.display = 'block';
}
