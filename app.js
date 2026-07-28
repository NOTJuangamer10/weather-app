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
