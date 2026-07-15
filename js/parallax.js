/* ============================================================
   PARALLAX — el scroll apunta el destino de la cámara; la
   transición CSS del compositor hace el viaje lento y fluido.
   Incluye el parallax de profundidad de las marcas de agua.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Cámara de fondo */
  var bg = document.getElementById("bgImg");
  if (bg && !reduce) {
    var cam = [
      { s: 1.14, x: 0,   y: 0   },
      { s: 1.52, x: -11, y: 7   },
      { s: 1.78, x: 12,  y: -9  },
      { s: 1.36, x: -9,  y: -11 },
      { s: 1.66, x: 10,  y: 10  },
      { s: 1.44, x: -8,  y: 4   },
      { s: 1.88, x: 0,   y: 13  }
    ];
    var cur = { s: 0, x: 0, y: 0 };

    var camAt = function (p) {
      p = Math.min(1, Math.max(0, p)) * (cam.length - 1);
      var i = Math.min(cam.length - 2, Math.floor(p));
      var t = p - i;
      t = t * t * (3 - 2 * t);
      var a = cam[i], b = cam[i + 1];
      return { s: a.s + (b.s - a.s) * t, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    };
    var progreso = function () {
      var doc = document.documentElement;
      return doc.scrollHeight > doc.clientHeight
        ? (window.scrollY || doc.scrollTop) / (doc.scrollHeight - doc.clientHeight) : 0;
    };
    var pendiente = false;
    var apuntar = function () {
      pendiente = false;
      var c = camAt(progreso());
      if (Math.abs(c.s - cur.s) < .0008 && Math.abs(c.x - cur.x) < .01 && Math.abs(c.y - cur.y) < .01) return;
      cur = c;
      bg.style.transform = "scale(" + c.s.toFixed(4) + ") translate3d(" + c.x.toFixed(3) + "%," + c.y.toFixed(3) + "%,0)";
    };
    window.addEventListener("scroll", function () {
      /* micro-throttle: agrupa ráfagas de eventos sin perder el último */
      if (pendiente) return;
      pendiente = true;
      setTimeout(apuntar, 40);
    }, { passive: true });
    window.addEventListener("resize", apuntar, { passive: true });
    apuntar();
  }

  /* Marcas de agua: flotan a otra velocidad que el contenido */
  var wms = document.querySelectorAll(".wm");
  if (wms.length && !reduce) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY || 0;
      wms.forEach(function (w, i) {
        var f = i % 2 === 0 ? -.06 : .05;
        var base = w.classList.contains("wm-izq") ? "rotate(7deg)" : "rotate(-8deg)";
        w.style.transform = "translateY(" + (y * f).toFixed(1) + "px) " + base;
      });
    }, { passive: true });
  }
})();
