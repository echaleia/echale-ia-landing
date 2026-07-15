/* ============================================================
   FORMULARIO — wizard de 4 pasos → lead → comunidad WhatsApp.
   El avance se calcula desde el paso donde ocurrió el click
   (no desde una variable global) y hay candado anti doble-click:
   imposible saltarse pasos. El envío es SIEMPRE explícito en el
   paso 4 y exige aceptar el tratamiento de datos.
   ============================================================ */
(function () {
  "use strict";
  var form = document.getElementById("leadForm");
  if (!form) return;

  var waLink = form.getAttribute("data-whatsapp");
  var endpoint = form.getAttribute("data-endpoint");
  var steps = form.querySelectorAll(".wiz-step");
  var fill = document.getElementById("wizFill");
  var count = document.getElementById("wizCount");
  var errDatos = document.getElementById("err-datos");
  var errFinal = document.getElementById("err-final");
  var ok = document.getElementById("formOk");
  var lock = false;

  function show(i) {
    i = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach(function (s, k) { s.classList.toggle("active", k === i); });
    fill.style.width = ((i + 1) / steps.length * 100) + "%";
    count.textContent = (i + 1) + " / " + steps.length;
  }
  function pasoDe(el) {
    var st = el.closest(".wiz-step");
    return st ? parseInt(st.getAttribute("data-step"), 10) : 0;
  }

  form.addEventListener("click", function (e) {
    var next = e.target.closest("[data-next]");
    var back = e.target.closest("[data-back]");
    var send = e.target.closest("[data-enviar]");
    var opt = e.target.closest(".opt");

    if (next) {
      var nombre = form.nombre.value.trim();
      var wa = form.whatsapp.value.trim();
      if (nombre.length < 2 || wa.replace(/\D/g, "").length < 7) {
        errDatos.classList.add("show");
        return;
      }
      errDatos.classList.remove("show");
      show(1);
      return;
    }
    if (back) { show(pasoDe(back) - 1); return; }
    if (send) { enviar(); return; }

    if (opt) {
      var grid = opt.closest(".opt-grid");
      grid.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("sel"); });
      opt.classList.add("sel");
      var key = grid.getAttribute("data-options-for");
      var hidden = form.querySelector('[name="' + key + '"]');
      if (hidden) hidden.value = opt.getAttribute("data-value");
      var paso = pasoDe(opt);
      /* Auto-avance solo en pasos intermedios; el 4 envía con su botón */
      if (paso < steps.length - 1 && !lock) {
        lock = true;
        setTimeout(function () { show(paso + 1); lock = false; }, 350);
      }
    }
  });

  function enviar() {
    var consent = document.getElementById("f-consent");
    if (!consent.checked) {
      errFinal.textContent = "Para reservar tu cupo necesitamos que aceptes el tratamiento de datos.";
      errFinal.classList.add("show");
      return;
    }
    errFinal.classList.remove("show");
    var data = new FormData(form);
    data.append("acepta_datos", "sí");
    data.append("fecha", new Date().toISOString());
    data.append("origen", "landing-web");
    if (endpoint && endpoint.indexOf("http") === 0) {
      fetch(endpoint, { method: "POST", body: data, mode: "no-cors" }).catch(function () {});
    }
    steps.forEach(function (s) { s.classList.remove("active"); });
    form.querySelector(".wiz-progress").style.visibility = "hidden";
    ok.classList.add("show");
    var fb = document.getElementById("waFallback");
    fb.href = waLink;
    setTimeout(function () { window.open(waLink, "_blank", "noopener"); }, 1400);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); });
})();
