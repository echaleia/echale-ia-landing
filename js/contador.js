/* ============================================================
   CUPOS + RELOJ — el marcador de urgencia de la landing.
   · Arranca en 347 ocupados (quedan 153 de 500).
   · Baja por fecha: cada día que pasa hacia el 2 de agosto se
     descuentan cupos, así quien vuelve otro día ve el avance.
   · Baja en vivo: mientras la persona navega, cae 1 cupo cada
     tanto (con tope por visita) y el número palpita al bajar.
   · Se guarda en el navegador para que al recargar no "suba".
   · Widget flotante: cuando el marcador del hero sale de
     pantalla, aparece la pastilla en la esquina y se le ve bajar.
   · Reloj compacto: cuenta regresiva secundaria en una línea.
   ============================================================ */
(function () {
  "use strict";

  var TOTAL = 500;          /* cupos totales */
  var INICIAL = 153;        /* restantes el día de referencia (347 ocupados) */
  var PISO = 19;            /* nunca baja de aquí solo */
  var BAJA_POR_DIA = 4;     /* descuento diario automático */
  var MAX_BAJADA_VISITA = 15;
  var REF = new Date("2026-07-16T00:00:00-05:00").getTime();
  var EVENTO = new Date("2026-08-02T20:00:00-05:00").getTime();

  /* ---------- número actual ---------- */
  function baseHoy() {
    var dias = Math.max(0, Math.floor((Date.now() - REF) / 864e5));
    return Math.max(PISO, INICIAL - dias * BAJA_POR_DIA);
  }
  var n = baseHoy();
  try {
    var guardado = parseInt(localStorage.getItem("echale_cupos"), 10);
    if (!isNaN(guardado)) { n = Math.min(guardado, n); }
  } catch (err) {}
  n = Math.max(PISO, n);

  function guardar() {
    try { localStorage.setItem("echale_cupos", "" + n); } catch (err) {}
  }

  /* ---------- pintar en todos los rincones ---------- */
  var nEls = document.querySelectorAll('[data-cupos="n"]');
  var tomadosEls = document.querySelectorAll('[data-cupos="tomados"]');
  var fillEls = document.querySelectorAll('[data-cupos="fill"]');

  function pintar(animar) {
    nEls.forEach(function (el) {
      el.textContent = n;
      if (animar) {
        el.classList.remove("tick");
        void el.offsetWidth; /* reinicia la animación */
        el.classList.add("tick");
      }
    });
    tomadosEls.forEach(function (el) { el.textContent = (TOTAL - n).toLocaleString("es-CO"); });
    fillEls.forEach(function (el) { el.style.width = ((TOTAL - n) / TOTAL * 100).toFixed(1) + "%"; });
  }
  pintar(false);
  guardar();

  /* ---------- goteo en vivo ---------- */
  var bajadas = 0;
  function programarBajada(ms) {
    setTimeout(function () {
      if (n > PISO && bajadas < MAX_BAJADA_VISITA) {
        n--; bajadas++;
        guardar();
        pintar(true);
      }
      if (n > PISO && bajadas < MAX_BAJADA_VISITA) {
        programarBajada(22000 + Math.random() * 26000);
      }
    }, ms);
  }
  /* la primera caída llega pronto, para que se vea el movimiento */
  programarBajada(9000 + Math.random() * 7000);

  /* ---------- widget flotante ---------- */
  var flotante = document.getElementById("cuposFlotante");
  var marcador = document.querySelector(".cupos");
  if (flotante && marcador) {
    var evaluar = function () {
      var r = marcador.getBoundingClientRect();
      flotante.classList.toggle("visible", r.bottom < 0);
    };
    window.addEventListener("scroll", evaluar, { passive: true });
    evaluar();
  }

  /* ---------- reloj compacto ---------- */
  var reloj = document.getElementById("cdCompact");
  if (reloj) {
    var pad = function (x) { return x < 10 ? "0" + x : "" + x; };
    (function tick() {
      var d = EVENTO - Date.now();
      if (d <= 0) { reloj.textContent = "¡hoy, 8:00 p.m.!"; return; }
      reloj.textContent = Math.floor(d / 864e5) + "d " +
        pad(Math.floor(d % 864e5 / 36e5)) + ":" +
        pad(Math.floor(d % 36e5 / 6e4)) + ":" +
        pad(Math.floor(d % 6e4 / 1e3));
      setTimeout(tick, 1000);
    })();
  }
})();
