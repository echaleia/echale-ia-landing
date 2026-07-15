/* ============================================================
   REVEAL — aparición progresiva de bloques al hacer scroll
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revs = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      });
    }, { threshold: .15, rootMargin: "0px 0px -40px 0px" });
    revs.forEach(function (el) { io.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add("on"); });
  }
})();
