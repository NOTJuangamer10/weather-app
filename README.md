# Weather App

> Search the current weather of any city using the OpenWeatherMap API.

![Status](https://img.shields.io/badge/status-beta_1-blue)
![Demo](https://img.shields.io/badge/demo-live-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## Live demo

https://notjuangamer10.github.io/weather-app/

## Features

- Search by city name
- Shows temperature, humidity, wind speed and feels-like temperature
- Description of the weather in Spanish
- Clean and simple UI

## Tech stack

| Layer    | Technology          |
|----------|---------------------|
| Markup   | HTML5               |
| Styles   | CSS3                |
| Logic    | Vanilla JavaScript  |
| API      | OpenWeatherMap      |

## Run locally

Just open `index.html` in any browser. No build step, no dependencies.

You need a free API key from [OpenWeatherMap](https://openweathermap.org/api).
Replace the `API_KEY` value at the top of `app.js` with your own.

## Roadmap

- [x] **Beta 1** — basic weather lookup
- [x] **Beta 2** — redesigned UI (glassmorphism, gradients, icons)
- [x] **Beta 3** — 5-day forecast + temperature chart
- [x] **Beta 4** — geolocation + favorites + PWA installable
      
## Lessons from building this

Things I learned the hard way while building this project.

### The fetch / promise chain is harder than it looks

My first version just did `fetch(url).then(...)` and the page crashed on
every error. Handling 404 (city not found), 401 (bad API key) and network
errors without breaking the page took me three attempts. The `.catch()`
block is not optional, and `.finally()` is the right place to hide the
"loading..." spinner, not the `.then()`.

### My editor's autocomplete kept rewriting `value` to `ariaValueMax`

Same bug in two projects now. Antigravity IDE has an AI autocomplete that
silently suggests property names, and if you don't disable "accept on any
key" it accepts them while you type. The autocomplete was rewriting
`input.value` to `input.ariaValueMax`, which is `undefined`, and calling
`.trim()` on it threw silently inside the submit handler. Took me forever
to spot because there's no visible error, just "nothing happens when I
click". Same thing happened with `reset` → `requestFullscreen` in my
other project. I disabled that suggestion.

### Function declarations get hoisted

When I tried to extend `mostrarClima` in Beta 3 by saving the old function
and redefining it, I caused infinite recursion. JavaScript hoists
`function declarations` to the top of the file, so when I did
`var old = mostrarClima`, `mostrarClima` was already the new version —
calling `old()` was calling the new one, which called itself forever.
The fix was to use a function expression instead:
`mostrarClima = function() { ... }`. Function expressions don't get
hoisted, so the order of execution is what you read.

### Random GIFs from Giphy don't represent the weather

My first version called the Giphy search API on every query and picked a
random result. Once I searched "London" and got a dancing water drop
instead of actual rain. The search API is too noisy for this use case.
I ended up picking one fixed GIF per weather type by hand (sun, rain,
snow, storm, fog, clouds) and hardcoding the URLs. Feels much more like
"looking at the sky of that city" — same view every time.

### The OpenWeatherMap forecast API returns a point every 3 hours

So 40 data points for 5 days, not 5. I had to group them by day and take
the actual max and min of all 8 three-hour readings inside each day.
Otherwise the "max" was just the temperature at a random hour, not the
real daily high.

### Canvas drawing is actually fun

I was going to use Chart.js for the temperature chart, but decided to
draw it with vanilla `canvas.getContext('2d')` and `moveTo` / `lineTo` /
`arc`. It's like 60 lines of code and the result is exactly what I wanted.
No external dependency, no learning a charting API, just points and lines.
I'll probably keep doing this for simple charts.

## AI usage declaration

This project was built with the assistance of AI. The author has limited
programming experience and used AI (Gemini and an AI coding assistant) as
a learning tool and coding teacher throughout the project.

AI helped with:
- Explaining JavaScript, HTML and CSS concepts the author didn't understand
- Writing the initial code structure for each feature
- Debugging issues, especially recurring autocomplete bugs in the editor
  that kept rewriting `value` to `ariaValueMax` and `reset` to
  `requestFullscreen`
- Suggesting improvements and refactors

The author:
- Made all design decisions (color palette, layout, which features to
  include in each beta)
- Reviewed and tested every line of generated code
- Asked for explanations until they understood what each part does
- Modified code to fit their needs and learning style

The project is the author's in the sense that they directed it, chose what
to build, and understood what was built. AI was a teacher and assistant,
not the sole creator.
## Author

Made by hand as a learning project.
