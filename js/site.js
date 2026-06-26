/* ============================================================
   DRAMAKAZE — content renderer
   Reads window.DRAMAKAZE (js/content.js) and fills any element
   with a [data-render] attribute: roster | releases | discography | artists
   Photos are styled for disposable-camera shots (film frame + date stamp).
   ============================================================ */
(function () {
  "use strict";
  var DATA = window.DRAMAKAZE || { artists: [], releases: [] };

  // alias resolution + hidden artists
  var ALIAS = {}, HIDDEN = {};
  (DATA.artists || []).forEach(function (a) {
    ALIAS[a.name] = a.name;
    (a.aliases || []).forEach(function (al) { ALIAS[al] = a.name; });
    if (a.hidden) { HIDDEN[a.name] = 1; (a.aliases || []).forEach(function (al) { HIDDEN[al] = 1; }); }
  });
  function disp(n) { return ALIAS[n] || n; }            // persona -> parent name
  function onRoster(a) { return a.signed === true; }    // ACTIVE signed roster only
  function relShown(r) { return !HIDDEN[r.artist] && !HIDDEN[disp(r.artist)]; }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function isExample(s) { return /^EXAMPLE/i.test(String(s || "")); }

  /* ---- Spotify: turn any spotify link into an embed iframe ---- */
  function spotify(url, compact) {
    if (!url) return "";
    var m = String(url).match(/(track|album|artist|playlist|episode|show)[\/:]([A-Za-z0-9]+)/);
    if (!m) return "";
    var h = compact ? 152 : (m[1] === "track" ? 152 : 352);
    return '<iframe class="spotify-embed" style="border-radius:12px" loading="lazy" ' +
      'src="https://open.spotify.com/embed/' + m[1] + '/' + m[2] + '?utm_source=dramakaze" ' +
      'width="100%" height="' + h + '" frameborder="0" allow="autoplay; clipboard-write; ' +
      'encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>';
  }

  /* ---- Bandcamp: embed player from an album id ---- */
  function bandcamp(id) {
    if (!id) return "";
    return '<iframe class="bandcamp-embed" style="border:0;width:100%;height:120px" loading="lazy" seamless ' +
      'src="https://bandcamp.com/EmbeddedPlayer/album=' + esc(id) +
      '/size=large/bgcol=fcfbf9/linkcol=ca2030/tracklist=false/artwork=none/transparent=true/"></iframe>';
  }

  /* ---- framed photo (disposable look) or a marked placeholder ---- */
  function frame(src, alt, ratio, stamp) {
    var s = stamp ? '<span class="ph-stamp">' + esc(stamp) + "</span>" : "";
    if (src) {
      return '<div class="ph-frame" style="aspect-ratio:' + ratio + '">' +
        '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" />' + s + "</div>";
    }
    return '<div class="ph-frame ph-empty" style="aspect-ratio:' + ratio + '">' +
      '<img src="assets/logo/logomark-black.png" alt="" />' +
      '<span class="placeholder-note">Disposable pending</span>' + s + "</div>";
  }

  function links(a) {
    var out = [];
    if (a.spotify)   out.push('<a href="' + esc(a.spotify) + '" target="_blank" rel="noopener">Spotify &#8599;</a>');
    if (a.instagram) out.push('<a href="' + esc(a.instagram) + '" target="_blank" rel="noopener">Instagram &#8599;</a>');
    if (a.site)      out.push('<a href="' + esc(a.site) + '" target="_blank" rel="noopener">Link &#8599;</a>');
    return out.length ? '<div class="meta-links">' + out.join("") + "</div>" : "";
  }

  /* ---- renderers ---- */
  function roster(el) {
    el.innerHTML = DATA.artists.filter(onRoster).map(function (a, i) {
      var no = "A—" + String(i + 1).padStart(2, "0");
      return '<article class="card art-card' + (isExample(a.name) ? " is-example" : "") + '">' +
        frame(a.photo, a.name, "4 / 3", "") +
        '<div class="art-card__body"><span class="card__no">' + no + "</span>" +
        '<div class="card__name">' + esc(a.name) + "</div>" +
        '<div class="card__role">' + esc(a.role) + "</div>" + links(a) + "</div></article>";
    }).join("") || empty("Active roster — coming soon.");
  }

  function releaseCard(r, withPlayer) {
    var title = r.title ? esc(r.title) : "Untitled " + esc(r.type || "release");
    var tl = (withPlayer && r.tracks && r.tracks.length)
      ? '<ol class="tracklist">' + r.tracks.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol>" : "";
    return '<article class="release">' +
      frame(r.art, r.title || r.type, "1 / 1", r.year) +
      '<div class="release__meta">' +
      (r.type ? '<span class="tag">' + esc(r.type) + "</span>" : "") +
      '<div class="release__title' + (r.title ? "" : " untitled") + '">' + title + "</div>" +
      '<div class="release__sub">' + esc(disp(r.artist)) + (r.year ? " — " + esc(r.year) : "") + "</div>" +
      tl +
      (withPlayer && r.spotify ? '<div class="player">' + spotify(r.spotify, true) + "</div>"
        : (withPlayer && r.bandcamp ? '<div class="player">' + bandcamp(r.bandcamp) + "</div>" : "")) +
      "</div></article>";
  }
  function releases(el) {   // homepage: latest few only
    el.innerHTML = DATA.releases.filter(relShown).slice(0, 8).map(function (r) { return releaseCard(r, false); }).join("") ||
      empty("No releases yet — add them in js/content.js");
  }
  function discography(el) {
    el.innerHTML = DATA.releases.filter(relShown).map(function (r) { return releaseCard(r, true); }).join("") ||
      empty("No releases yet — add them in js/content.js");
  }
  function artists(el) {
    el.innerHTML = DATA.artists.filter(onRoster).map(function (a) {
      return '<article class="artist-row' + (isExample(a.name) ? " is-example" : "") + '">' +
        frame(a.photo, a.name, "4 / 3", "") +
        '<div class="artist-row__body"><h3 class="artist-row__name">' + esc(a.name) + "</h3>" +
        '<div class="card__role">' + esc(a.role) + "</div>" +
        (a.bio ? "<p>" + esc(a.bio) + "</p>" : "") + links(a) +
        (a.spotify ? '<div class="player">' + spotify(a.spotify, false) + "</div>" : "") +
        "</div></article>";
    }).join("") || empty("No artists currently signed — roster forthcoming.");
  }
  function studio(el) {
    var list = DATA.studio || [];
    el.innerHTML = list.map(function (c) {
      var who = c.link
        ? '<a href="' + esc(c.link) + '" target="_blank" rel="noopener">' + esc(c.client) + " &#8599;</a>"
        : esc(c.client);
      return '<div class="credit-row' + (isExample(c.client) ? " is-example" : "") + '">' +
        '<span class="who">' + who + (c.title ? "<small>" + esc(c.title) + "</small>" : "") + "</span>" +
        '<span class="what">' + esc(c.role) + (c.year ? " · " + esc(c.year) : "") + "</span></div>";
    }).join("") || empty("No studio credits yet — add them in js/content.js");
  }
  function empty(msg) {
    return '<div class="boxed" style="padding:clamp(24px,4vw,44px);text-align:center;color:var(--muted)">' +
      '<p class="placeholder-note">' + esc(msg) + "</p></div>";
  }

  var R = { roster: roster, releases: releases, discography: discography, artists: artists, studio: studio };
  document.querySelectorAll("[data-render]").forEach(function (el) {
    var fn = R[el.getAttribute("data-render")];
    if (fn) fn(el);
  });
})();
