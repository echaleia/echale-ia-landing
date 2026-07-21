
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
    var otroOk = e.target.closest("[data-otro-ok]");
    var opt = e.target.closest(".opt");

    /* "Otro" exige contar cuál antes de avanzar */
    if (otroOk) {
      var otroInput = document.getElementById("f-otro");
      var errOtro = document.getElementById("err-otro");
      var detalle = otroInput ? otroInput.value.trim() : "";
      if (detalle.length < 3) {
        errOtro.classList.add("show");
        if (otroInput) otroInput.focus();
        return;
      }
      errOtro.classList.remove("show");
      form.querySelector('[name="tipo_negocio"]').value = "Otro: " + detalle;
      show(2);
      return;
    }

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

      /* Si eligió "Otro", se abre el campo de detalle y NO avanza solo */
      var otroCampo = document.getElementById("otroCampo");
      var pideDetalle = opt.hasAttribute("data-requiere-detalle");
      if (otroCampo && key === "tipo_negocio") {
        otroCampo.hidden = !pideDetalle;
        if (pideDetalle) {
          var inp = document.getElementById("f-otro");
          if (inp) inp.focus();
        }
      }
      if (pideDetalle) return;

      var paso = pasoDe(opt);
      /* Auto-avance solo en pasos intermedios; el 4 envía con su botón */
      if (paso < steps.length - 1 && !lock) {
        lock = true;
        setTimeout(function () { show(paso + 1); lock = false; }, 350);
      }
    }
  });

  /* Enter dentro del campo "Otro" = Continuar */
  var otroInputRef = document.getElementById("f-otro");
  if (otroInputRef) {
    otroInputRef.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        ev.preventDefault();
        var b = form.querySelector("[data-otro-ok]");
        if (b) b.click();
      }
    });
  }

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
     if (typeof fbq === "function") {
      fbq('track', 'Lead');
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
