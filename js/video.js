/* ============================================================
   VIDEO — demostración IA + Google Maps. Click para reproducir;
   se pausa solo si el usuario deja atrás la sección.
   ============================================================ */
(function () {
  "use strict";
  var vsl = document.getElementById("vsl");
  var vid = document.getElementById("vidPlayer");
  if (!vsl || !vid) return;

  var reproducir = function () {
    if (vsl.classList.contains("playing")) return;
    vsl.classList.add("playing");
    vid.controls = true;
    vid.play();
  };
  vsl.addEventListener("click", reproducir);
  vsl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reproducir(); }
  });

  /* Si sale del viewport reproduciéndose, pausa (ahorra datos y atención) */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting && !vid.paused) { vid.pause(); } });
    }, { threshold: .15 }).observe(vsl);
  }
})();
