// Weather App Beta 1
// llama a la API de OpenWeatherMap para sacar el clima de una ciudad

// === PON AQUI TU API KEY ===
// la sacas gratis en https://openweathermap.org/api
// te registras, vas a tu perfil > API keys, copias la key
var API_KEY = 'c080b323e9d172f81ba7593f715826d5';
// ============================

// pillar los elementos del HTML
var formulario = document.getElementById('form-clima');
var inputCiudad = document.getElementById('input-ciudad');
var cargando = document.getElementById('cargando');
var error = document.getElementById('error');
var resultado = document.getElementById('resultado');
var ciudad = document.getElementById('ciudad');
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

// pinto el clima en el HTML
function mostrarClima(datos) {
    ciudad.textContent = datos.name + ', ' + datos.sys.country;
    temp.textContent = Math.round(datos.main.temp) + '\u00B0C';
    descripcion.textContent = datos.weather[0].description;
    detalles.innerHTML = '';

    // humedad
    detalles.appendChild(crearDetalle('Humedad', datos.main.humidity + '%'));
    // viento
    detalles.appendChild(crearDetalle('Viento', datos.wind.speed + ' km/h'));
    // sensacion termica
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
