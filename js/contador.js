/* ============================================================
   CONTADOR — cuenta regresiva a la masterclass:
   domingo 2 de agosto de 2026, 8:00 p.m. hora Colombia (UTC-5)
   ============================================================ */
(function () {
  "use strict";
  var target = new Date("2026-08-02T20:00:00-05:00").getTime();
  var D = document.getElementById("cdD"), H = document.getElementById("cdH"),
      M = document.getElementById("cdM"), S = document.getElementById("cdS");
  if (!D) return;

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var d = target - Date.now();
    if (d <= 0) { D.textContent = H.textContent = M.textContent = S.textContent = "00"; return; }
    D.textContent = pad(Math.floor(d / 864e5));
    H.textContent = pad(Math.floor(d % 864e5 / 36e5));
    M.textContent = pad(Math.floor(d % 36e5 / 6e4));
    S.textContent = pad(Math.floor(d % 6e4 / 1e3));
    setTimeout(tick, 1000);
  }
  tick();
})();
