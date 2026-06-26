/* ============================================================
   DRAMAKAZE RECORDS — interactions
   - logomark cursor follower (desktop fine-pointer only)
   - spinning logomark easter egg
   - konami "needle drop" easter egg
   - mobile nav toggle
   ============================================================ */
(function () {
  "use strict";

  /* ---------- LOGO-NAV: each letter is a door ----------
     Angular clip-paths follow the real letterforms (measured off the
     artwork). The A's left/right walls slash into their neighbours; the
     record disc is its own circular zone -> hidden B-side easter egg.
     Tweak a "clip" string to nudge any cut — x%/y% of the wordmark box. */
  var LETTERS = [
    { ch:"D", label:"Discography",        href:"discography.html", clipHit:"polygon(5% 23%, 15.5% 23%, 15.5% 72%, 5% 72%)", clip:"polygon(16.8% 23%, 16.8% 29.6%, 23.2% 30.1%, 16.8% 33%, 16.8% 35.7%, 16.8% 36.5%, 16.8% 40.2%, 19% 42.1%, 16.8% 72%, 3.7% 72%, 3.7% 66.8%, 3.7% 60.5%, 3.7% 60%, 3.7% 58.5%, 3.7% 50.9%, 3.7% 50.5%, 3.7% 42.2%, 3.7% 40.6%, 3.7% 37%, 3.7% 23%)" },
    { ch:"R", label:"Recording Studio",   href:"studio.html",      clipHit:"polygon(15.5% 23%, 28.5% 23%, 24% 72%, 15.5% 72%)", clip:"polygon(29.8% 23%, 29% 31.7%, 28% 42.8%, 31.4% 43%, 27.6% 47.2%, 26.8% 56%, 26.7% 56.8%, 26.6% 58.3%, 26.1% 63.8%, 25.7% 67.1%, 25.3% 72%, 14.2% 72%, 14.2% 57.3%, 14.2% 56%, 11.8% 51%, 14.2% 46.8%, 14.2% 45.5%, 11.7% 32.2%, 14.2% 23%)" },
    { ch:"A", label:"Artists",            href:"artists.html",     clipHit:"polygon(28.5% 23%, 33.5% 23%, 33.5% 72%, 24% 72%)", clip:"polygon(34.8% 23%, 34.8% 47.8%, 34.8% 57.7%, 34.8% 61.1%, 38.2% 63.8%, 34.8% 64.6%, 38.8% 67.3%, 34.8% 72%, 22.7% 72%, 18.9% 68.2%, 17.6% 59.3%, 22% 58.8%, 20.7% 36.1%, 26.4% 31.7%, 20.2% 29.9%, 27.2% 23%)" },
    { ch:"M", label:"Mixing & Mastering", href:"services.html",    clipHit:"polygon(33.5% 23%, 49.5% 23%, 45% 72%, 33.5% 72%)", clip:"polygon(50.8% 23%, 50.5% 26.7%, 50.2% 29.2%, 50% 32%, 49.2% 40.9%, 50.7% 50%, 51.1% 64.3%, 46.8% 66.4%, 46.3% 72%, 32.2% 72%, 32.2% 63.5%, 32.2% 62.2%, 32.2% 59.6%, 27.2% 54.9%, 28.6% 47%, 30.4% 41.9%, 32.2% 38.2%, 32.2% 33.4%, 32.2% 32%, 32.2% 23%)" },
    { ch:"A", label:"Coming soon", href:"#", clipHit:"polygon(49.5% 23%, 50.5% 23%, 55% 72%, 45% 72%)", clip:"polygon(51.8% 23%, 53.3% 39.5%, 53.5% 41.3%, 53.5% 41.6%, 53.6% 43%, 54.1% 47.9%, 55.4% 62.3%, 56.3% 72%, 43.7% 72%, 44.1% 68.1%, 45.2% 56.2%, 43.2% 53.9%, 45.5% 52.3%, 46.4% 42.9%, 42.2% 38%, 44.1% 30.6%, 47.7% 28.9%, 48.2% 23%)" },
    { ch:"K", label:"Coming soon", href:"#", clipHit:"polygon(50.5% 23%, 70% 23%, 64% 72%, 55% 72%)", clip:"polygon(71.3% 23%, 70.9% 26.4%, 70.9% 27.6%, 70.7% 32.4%, 71.3% 45.5%, 68.2% 48.2%, 67.7% 52.5%, 70% 53.5%, 66.6% 61.8%, 70.6% 67.5%, 65.3% 72%, 53.7% 72%, 49% 56.7%, 50.8% 56.5%, 50.6% 37.8%, 50.5% 37%, 50.2% 34.3%, 50% 31.5%, 49.9% 30.6%, 49.2% 23%)" },
    { ch:"A", label:"Coming soon", href:"#", clipHit:"polygon(70% 23%, 70.5% 23%, 76% 72%, 64% 72%)", clip:"polygon(71.8% 23%, 73.6% 39.3%, 73.7% 39.9%, 73.7% 40.3%, 78.7% 42.3%, 77.4% 50.6%, 75.2% 53.5%, 77.3% 72%, 62.7% 72%, 63.1% 68.8%, 59.1% 68%, 63.5% 65.1%, 64.1% 60.2%, 62.9% 49.9%, 66.4% 41.8%, 65.3% 31.5%, 65.1% 29.3%, 68% 28.5%, 68.7% 23%)" },
    { ch:"Z", label:"Coming soon", href:"#", clipHit:"polygon(70.5% 23%, 85% 23%, 85% 72%, 76% 72%)", clip:"polygon(86.3% 23%, 86.3% 27.4%, 86.3% 36.1%, 86.3% 39%, 86.3% 50.9%, 86.3% 53.7%, 86.3% 54.6%, 86.3% 72%, 74.7% 72%, 73.8% 63.8%, 73.5% 61.1%, 73.3% 59.1%, 72.1% 49.2%, 68.7% 45.8%, 69.7% 41%, 70.9% 38.5%, 70.2% 36.5%, 69.9% 29.4%, 69.2% 23%)" },
    { ch:"E", label:"Coming soon", href:"#", clipHit:"polygon(85% 23%, 94.5% 23%, 94.5% 72%, 85% 72%)", clip:"polygon(95.8% 23%, 95.8% 36.5%, 95.8% 38.5%, 95.8% 39.2%, 95.8% 42.5%, 95.8% 42.9%, 95.8% 50.6%, 95.8% 52.2%, 95.8% 64.7%, 95.8% 72%, 83.7% 72%, 83.7% 66.2%, 83.7% 65.3%, 83.7% 63%, 83.7% 62.5%, 78% 57%, 83.7% 56.9%, 83.7% 48.9%, 81.1% 38.7%, 83.7% 27.1%, 83.7% 23%)" },
    { ch:"●", label:"B-side", href:"#", clip:"circle(4.7% at 83.18% 68.92%)", egg:true }
  ];
  var HILITE_SRC = "assets/logo/logotype-black.svg";

  var logoNav = document.getElementById("logoNav");
  var caption = document.getElementById("logoCaption");
  if (logoNav) {
    var hintHTML = caption ? caption.innerHTML : "";
    LETTERS.forEach(function (L) {
      // black copy of the wordmark, clipped to this letter's jagged shard;
      // wrapper kept for crisp opacity toggling
      var wrap = document.createElement("div");
      wrap.className = "logo-hi-wrap";
      var hi = document.createElement("img");
      hi.className = "logo-hi";
      hi.src = HILITE_SRC; hi.alt = ""; hi.setAttribute("aria-hidden", "true");
      hi.style.clipPath = L.clip; hi.style.setProperty("-webkit-clip-path", L.clip);
      wrap.appendChild(hi);
      logoNav.appendChild(wrap);

      // hit-zone uses the CLEAN letter shape (spiky visual would overlap neighbours)
      var hitClip = L.clipHit || L.clip;
      var a = document.createElement("a");
      a.className = "logo-zone" + (L.egg ? " logo-zone--rec" : "");
      a.href = L.href;
      a.style.clipPath = hitClip; a.style.setProperty("-webkit-clip-path", hitClip);
      a.setAttribute("aria-label", L.egg ? "Hidden B-side" : (L.ch + " — " + L.label));
      a.title = L.label;

      function on() {
        wrap.style.opacity = "1";
        if (caption) caption.innerHTML =
          '<span class="lead"><span class="key">' + (L.egg ? "&#9210;" : L.ch) + '</span>' + L.label +
          ((L.href === "#" && !L.egg) ? "" : ' <span class="ar">&#8599;</span>') + '</span>';
      }
      function off() { wrap.style.opacity = "0"; if (caption) caption.innerHTML = hintHTML; }
      a.addEventListener("mouseenter", on);
      a.addEventListener("mouseleave", off);
      a.addEventListener("focus", on);
      a.addEventListener("blur", off);

      if (L.egg) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          document.querySelectorAll(".spinmark, .callout__side img").forEach(function (m) {
            m.classList.add("spin"); setTimeout(function () { m.classList.remove("spin"); }, 1900);
          });
          flashEgg("&#9210; You found the B-side");
        });
      } else if (L.href === "#") {
        a.addEventListener("click", function (e) { e.preventDefault(); });
      }
      logoNav.appendChild(a);
    });
  }

  /* ---------- mobile nav ---------- */
  var topbar = document.getElementById("topbar");
  var toggle = document.getElementById("navToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = topbar.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    topbar.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { topbar.classList.remove("open"); });
    });
  }

  /* ---------- custom cursor: red dot takes over the pointer ---------- */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine) {
    var dot = document.querySelector(".cursor-dot");
    if (dot) {
      document.body.classList.add("has-mark-cursor");
      window.addEventListener("mousemove", function (e) {
        dot.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
      });
    }
  }

  /* ---------- spinning logomark easter egg ---------- */
  var spin = document.getElementById("spinmark");
  if (spin) {
    spin.addEventListener("click", function () {
      spin.classList.remove("spin");
      // reflow to restart animation
      void spin.offsetWidth;
      spin.classList.add("spin");
      flashEgg("&#9210; 33&#8531; RPM");
    });
  }

  /* ---------- konami needle-drop easter egg ---------- */
  var seq = [38,38,40,40,37,39,37,39,66,65];
  var pos = 0;
  window.addEventListener("keydown", function (e) {
    pos = (e.keyCode === seq[pos]) ? pos + 1 : 0;
    if (pos === seq.length) {
      pos = 0;
      document.querySelectorAll(".spinmark, .callout__side img").forEach(function (m) {
        m.classList.add("spin");
        setTimeout(function () { m.classList.remove("spin"); }, 1900);
      });
      flashEgg("&#9210; Needle dropped.");
    }
  });

  /* ---------- egg toast ---------- */
  var egg = document.getElementById("egg");
  var eggT;
  function flashEgg(html) {
    if (!egg) return;
    egg.innerHTML = html;
    egg.classList.add("show");
    clearTimeout(eggT);
    eggT = setTimeout(function () { egg.classList.remove("show"); }, 1600);
  }
})();
