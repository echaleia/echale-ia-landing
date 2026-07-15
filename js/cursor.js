/* ============================================================
   CURSOR — halo que sigue al mouse, ripple dorado en cada
   click y tilt 3D del panel del hero. Solo puntero fino.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* Halo del cursor (el rezago elegante lo pone la transición CSS) */
  if (finePointer && !reduce) {
    var cglow = document.getElementById("cursorGlow");
    if (cglow) {
      document.addEventListener("mousemove", function (e) {
        cglow.style.transform = "translate(" + (e.clientX - 110) + "px," + (e.clientY - 110) + "px)";
      }, { passive: true });
    }
  }

  /* Ripple en cada click */
  if (!reduce) {
    document.addEventListener("click", function (e) {
      var host = e.target.closest(".btn, .opt, .faq summary");
      if (!host) return;
      var r = host.getBoundingClientRect();
      var d = Math.max(r.width, r.height);
      var sp = document.createElement("span");
      sp.className = "ripple";
      sp.style.width = sp.style.height = d + "px";
      sp.style.left = (e.clientX - r.left - d / 2) + "px";
      sp.style.top = (e.clientY - r.top - d / 2) + "px";
      host.appendChild(sp);
      setTimeout(function () { sp.remove(); }, 700);
    });
  }

  /* Tilt 3D sutil de la tarjeta hero */
  var hcard = document.getElementById("heroCard");
  if (hcard && finePointer && !reduce) {
    var hero = document.querySelector(".hero");
    hero.addEventListener("mousemove", function (e) {
      var r = hcard.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      hcard.style.transform = "perspective(900px) rotateY(" + (dx * 2.5).toFixed(2) + "deg) rotateX(" + (-dy * 2.5).toFixed(2) + "deg) translateZ(0)";
    }, { passive: true });
    hero.addEventListener("mouseleave", function () {
      hcard.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    });
  }
})();
