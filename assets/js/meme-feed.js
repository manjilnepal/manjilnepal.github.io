/* From the Timeline page (miscellaneous/timeline/).
   1. Builds the venue jump links from each <section class="meme-conf">.
   2. Upgrades each plain post link in every .meme-feed into an embedded post:
      X / Twitter links become official tweet embeds (rendered by widgets.js);
      LinkedIn links become LinkedIn's embed iframe. Anything else, or any
      embed that fails to load, stays as the plain link it started as. */
(function () {
  // ── Venue jump links ──
  var confNav = document.querySelector('.meme-confs');
  var confs = document.querySelectorAll('.meme-conf[id]');
  if (confNav) {
    confs.forEach(function (sec) {
      var h = sec.querySelector('h2');
      var label = h ? (h.firstChild.textContent || h.textContent).trim() : sec.id;
      var count = sec.querySelectorAll('.meme-feed li').length;
      var a = document.createElement('a');
      a.href = '#' + sec.id;
      a.textContent = label;
      var n = document.createElement('span');
      n.className = 'meme-conf-count';
      n.textContent = count;
      a.appendChild(n);
      confNav.appendChild(a);
    });
    if (!confs.length) confNav.hidden = true;
  }

  // ── Embeds ──
  var X_RE = /^https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/([^/?#]+)\/status(?:es)?\/(\d+)/i;
  // Matches both /posts/<slug>-activity-<id>-xxxx and /feed/update/urn:li:activity:<id>
  var LI_RE = /linkedin\.com\/.*?(activity|ugcPost|share)[-:](\d{15,25})/i;

  var needsTwitter = false;

  document.querySelectorAll('.meme-feed a[href]').forEach(function (link) {
    var url = link.href.trim();
    var item = link.closest('li') || link.parentNode;
    var m;

    if ((m = url.match(X_RE))) {
      var text = link.textContent.trim() || ('@' + m[1] + ' on X \u2192');
      var quote = document.createElement('blockquote');
      quote.className = 'twitter-tweet';
      quote.setAttribute('data-dnt', 'true');
      quote.setAttribute('data-align', 'center');
      quote.setAttribute('data-conversation', 'none');
      var a = document.createElement('a');
      a.href = 'https://twitter.com/' + m[1] + '/status/' + m[2];
      a.textContent = text;
      quote.appendChild(a);
      item.replaceChildren(quote);
      item.classList.add('meme-x');
      needsTwitter = true;
    } else if ((m = url.match(LI_RE))) {
      var frame = document.createElement('iframe');
      frame.src = 'https://www.linkedin.com/embed/feed/update/urn:li:' + m[1] + ':' + m[2];
      frame.title = 'Embedded LinkedIn post';
      frame.loading = 'lazy';
      frame.allowFullscreen = true;
      // LinkedIn embeds do not auto-size; data-height on the link overrides.
      frame.height = link.dataset.height || '640';
      var fallback = document.createElement('a');
      fallback.href = url;
      fallback.target = '_blank';
      fallback.rel = 'noopener';
      fallback.className = 'meme-li-link';
      fallback.textContent = 'Open on LinkedIn →';
      item.replaceChildren(frame, fallback);
      item.classList.add('meme-li');
    }
  });

  if (needsTwitter) {
    var s = document.createElement('script');
    s.src = 'https://platform.twitter.com/widgets.js';
    s.async = true;
    s.charset = 'utf-8';
    document.body.appendChild(s);
  }
})();
