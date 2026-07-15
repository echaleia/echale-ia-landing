# Échale IA — Landing de la masterclass

Landing page de registro a la masterclass gratuita del **domingo 2 de agosto, 8:00 p.m.** (hora Colombia). HTML/CSS/JS vanilla, sin frameworks ni build steps.

## Cómo arrancar un servidor local

Desde esta carpeta (`Web/`):

```
python -m http.server 4175
```

y abre `http://localhost:4175`. Cualquier servidor estático sirve (`npx serve`, Live Server de VS Code, etc.).

## Estructura

```
Web/
├── index.html          ← markup semántico, sin estilos ni scripts inline
├── css/
│   ├── base.css        ← reset, variables (:root), tipografía global, utilidades
│   ├── fondo.css       ← foto marina con cámara parallax, viñeta, grano, cursor, marcas de agua
│   ├── componentes.css ← vidrio líquido (.glass), botones, reveal, ripple
│   ├── nav.css         ← barra de navegación flotante
│   ├── hero.css        ← titular, contador tipográfico, CTA, panel de sesión
│   ├── problema.css    ← filas editoriales con cifras gigantes
│   ├── duelo.css       ← chats antes/después sincronizados
│   ├── video.css       ← reproductor de la demo IA + Google Maps
│   ├── capacidades.css ← columnas de revista con numerales
│   ├── bonos.css       ← línea de tiempo dorada
│   ├── faq.css         ← acordeón de líneas
│   ├── registro.css    ← formulario por pasos (wizard)
│   └── footer.css      ← cierre de marca
├── js/
│   ├── parallax.js     ← cámara de fondo dirigida por scroll + marcas de agua
│   ├── cursor.js       ← halo del mouse, ripple de clicks, tilt 3D del hero
│   ├── reveal.js       ← aparición de bloques al hacer scroll
│   ├── contador.js     ← cuenta regresiva a la masterclass
│   ├── duelo.js        ← animación de los 3 duelos antes/después
│   ├── video.js        ← reproducción del video con capa de play
│   └── formulario.js   ← wizard de 4 pasos, validación, consentimiento y envío
├── img/                ← fondo marino, logos, avatar, marca de agua, póster del video
└── vid/
    └── video-landing.mp4  ← demo comprimida para web (17.7 MB, 720p)
```

## Pendientes operativos

- **Google Sheets:** el formulario apunta a `data-endpoint="PEGAR_URL_DE_GOOGLE_APPS_SCRIPT"` en `index.html`. Reemplazar por la URL real del Apps Script para que los leads se guarden (guía en `../guardar-datos-google-sheets.md`).
- El enlace del grupo de WhatsApp vive en `data-whatsapp` en el mismo `<form>`.
- La fecha/hora del contador se cambia en `js/contador.js` (una sola línea).

## Notas de diseño

- El tono marino del fondo está **horneado en `img/fondo-marino.jpg`** — no hay filtros de color en CSS (decisión de marca).
- El parallax usa eventos de scroll + transición CSS del compositor (no depende de `requestAnimationFrame`).
- Dorado de marca para letras: `--oro-luz: #D9A83C` en `css/base.css`.
