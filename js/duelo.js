/* ============================================================
   DUELO — antes/después: 3 conversaciones sincronizadas.
   Corre solo mientras la sección está a la vista y se congela
   PARA SIEMPRE cuando el usuario la deja atrás (el contenedor
   tiene además altura fija: cero saltos de scroll).
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var antes = document.getElementById("chatAntes");
  var despues = document.getElementById("chatDespues");
  if (!antes || !despues) return;

  var duelos = [
    {
      a: {
        inHTML: "Haz un resumen de inteligencia artificial",
        typing: "Generando respuesta…",
        outHTML: "La inteligencia artificial es un tema muy amplio que abarca muchas cosas y depende del contexto. Hay muchos tipos y enfoques, y se usa en muchas áreas hoy en día. Es difícil resumirlo porque cada área es un mundo… ¿quieres que profundice en algo en específico?",
        chip: "✗ Vaga y sin estructura — toca pedirla otra vez", chipCls: "chip-mal"
      },
      b: {
        inHTML: '<span class="tag">&lt;rol&gt;</span>Eres un profesor universitario.<span class="tag">&lt;/rol&gt;</span>\n<span class="tag">&lt;tarea&gt;</span>Resume qué es la inteligencia artificial.<span class="tag">&lt;/tarea&gt;</span>\n<span class="tag">&lt;formato&gt;</span>Escribe 3 párrafos y finaliza con una lista de 5 aplicaciones.<span class="tag">&lt;/formato&gt;</span>\n<span class="tag">&lt;audiencia&gt;</span>Estudiantes de primer semestre.<span class="tag">&lt;/audiencia&gt;</span>',
        inCode: true,
        typing: "Redactando con estructura…",
        outHTML: "<b>La inteligencia artificial</b> es la disciplina que diseña sistemas capaces de aprender de la información y resolver tareas que antes exigían razonamiento humano…\n\n<b>Aplicaciones:</b> 1. Asistentes de escritura · 2. Atención al cliente · 3. Análisis de datos · 4. Creación de contenido · 5. Organización de tareas",
        chip: "✓ Precisa, ordenada y lista para usar", chipCls: "chip-bien"
      }
    },
    {
      a: {
        inHTML: "Hazme un post para vender mis zapatos",
        typing: "Generando respuesta…",
        outHTML: "🔥 ¡GRAN OFERTA! 🔥 Los mejores zapatos al mejor precio. Calidad garantizada. ¡No te lo pierdas, compra ya! 👟✨ #zapatos #oferta #moda #shopping #tendencia",
        chip: "✗ Suena a anuncio genérico — nadie se detiene", chipCls: "chip-mal"
      },
      b: {
        inHTML: '<span class="tag">&lt;rol&gt;</span>Eres estratega de contenido de una marca de calzado.<span class="tag">&lt;/rol&gt;</span>\n<span class="tag">&lt;contexto&gt;</span>Clienta: mujer 25-40 que camina todo el día y valora la comodidad.<span class="tag">&lt;/contexto&gt;</span>\n<span class="tag">&lt;tarea&gt;</span>Escribe un post de Instagram del nuevo modelo en cuero.<span class="tag">&lt;/tarea&gt;</span>\n<span class="tag">&lt;formato&gt;</span>Gancho en primera línea, 2 beneficios, cierre con pregunta.<span class="tag">&lt;/formato&gt;</span>',
        inCode: true,
        typing: "Redactando con estructura…",
        outHTML: "«Caminaste 12 horas y tus pies ni se enteraron.»\n\nEso dicen de nuestro nuevo modelo en cuero: suela que amortigua cada paso y hechura que aguanta años, no temporadas.\n\n¿Te lo pruebas este fin de semana?",
        chip: "✓ Detiene el scroll — le habla a la clienta, no al producto", chipCls: "chip-bien"
      }
    },
    {
      a: {
        inHTML: "Responde este mensaje de un cliente enojado",
        typing: "Generando respuesta…",
        outHTML: "Estimado cliente: lamentamos los inconvenientes ocasionados. Su solicitud es muy importante para nosotros. Estaremos atentos a cualquier inquietud. Que tenga un feliz día.",
        chip: "✗ Frío y robótico — el cliente no vuelve", chipCls: "chip-mal"
      },
      b: {
        inHTML: '<span class="tag">&lt;rol&gt;</span>Eres el encargado de servicio de una tienda que cuida cada cliente.<span class="tag">&lt;/rol&gt;</span>\n<span class="tag">&lt;contexto&gt;</span>El pedido de Laura llegó 3 días tarde; era para un regalo.<span class="tag">&lt;/contexto&gt;</span>\n<span class="tag">&lt;tarea&gt;</span>Escribe la respuesta.<span class="tag">&lt;/tarea&gt;</span>\n<span class="tag">&lt;formato&gt;</span>Disculpa concreta + solución + gesto de compensación, tono humano.<span class="tag">&lt;/formato&gt;</span>',
        inCode: true,
        typing: "Redactando con estructura…",
        outHTML: "Laura, tienes toda la razón y te pido disculpas: tu pedido debió llegar el jueves.\n\nYa salió con envío prioritario y llega mañana antes del mediodía, sin costo. Y te dejamos un 15% para tu próxima compra.\n\nGracias por contárnoslo — nos ayuda a mejorar.",
        chip: "✓ Recupera a la clienta — disculpa, solución y gesto", chipCls: "chip-bien"
      }
    }
  ];

  var started = false, stopped = false, timers = [];
  function later(fn, ms) {
    if (stopped) return;
    timers.push(setTimeout(function () { if (!stopped) fn(); }, reduce ? Math.min(ms, 300) : ms));
  }
  function make(cls, html, isCode) {
    var d = document.createElement("div");
    d.className = cls + (isCode ? " prompt-code" : "");
    d.innerHTML = html;
    return d;
  }
  function playIn(body, sc) {
    var m = make("msg in", sc.inHTML, sc.inCode);
    body.appendChild(m);
    requestAnimationFrame(function () { m.classList.add("show"); });
  }
  function playTyping(body, sc) {
    var t = document.createElement("div");
    t.className = "typing-row";
    t.innerHTML = '<span class="typing-dots"><i></i><i></i><i></i></span> ' + sc.typing;
    body.appendChild(t);
    return t;
  }
  function playOut(body, sc) {
    var m = make("msg out", sc.outHTML, false);
    body.appendChild(m);
    requestAnimationFrame(function () { m.classList.add("show"); });
  }
  function playChip(body, sc) {
    var c = make("task-chip " + sc.chipCls, sc.chip, false);
    body.appendChild(c);
    requestAnimationFrame(function () { c.classList.add("show"); });
  }

  var idx = 0;
  function ciclo() {
    var d = duelos[idx];
    antes.innerHTML = ""; despues.innerHTML = "";
    playIn(antes, d.a);
    playIn(despues, d.b);
    later(function () {
      var t1 = playTyping(antes, d.a);
      var t2 = playTyping(despues, d.b);
      later(function () {
        t1.remove(); t2.remove();
        playOut(antes, d.a);
        playOut(despues, d.b);
        later(function () {
          playChip(antes, d.a);
          playChip(despues, d.b);
          later(function () {
            idx = (idx + 1) % duelos.length;
            ciclo();
          }, 6800);
        }, 900);
      }, 1900);
    }, 1000);
  }

  /* Si se detiene a mitad de escena, la completa al instante */
  function congelar() {
    stopped = true;
    timers.forEach(clearTimeout);
    var d = duelos[idx];
    [[antes, d.a], [despues, d.b]].forEach(function (par) {
      var body = par[0], sc = par[1];
      body.querySelectorAll(".typing-row").forEach(function (t) { t.remove(); });
      if (!body.querySelector(".msg.out")) { playOut(body, sc); }
      if (!body.querySelector(".task-chip")) { playChip(body, sc); }
    });
  }

  if ("IntersectionObserver" in window && !reduce) {
    var mo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !started) { started = true; ciclo(); }
        else if (!e.isIntersecting && started && !stopped) { congelar(); }
      });
    }, { threshold: .2 });
    mo.observe(antes.closest(".duel"));
  } else {
    ciclo();
    later(congelar, 26000);
  }
})();
