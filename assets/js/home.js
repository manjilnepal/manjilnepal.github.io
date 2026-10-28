// Human / AI view toggle. AI mode shows the page as plain Markdown —
// the same content, in the form a language model would rather read.
// The rendered view is the default and lives in the markup, so the page
// is unaffected with JS disabled.
(function () {
  var btn = document.getElementById('voice-toggle');
  var label = document.getElementById('voice-label');
  var human = document.getElementById('human-view');
  var md = document.getElementById('md-view');
  if (!btn || !human || !md) return;

  btn.addEventListener('click', function () {
    var toAI = btn.getAttribute('aria-checked') !== 'true';
    btn.setAttribute('aria-checked', String(toAI));
    human.hidden = toAI;
    md.hidden = !toAI;
    label.textContent = toAI ? 'AI' : 'Human';
    btn.title = toAI ? 'View the rendered page' : 'View this page as Markdown';
    window.scrollTo(0, 0);
  });
})();

// Publication figure lightbox. Each thumbnail is a plain link to the
// image, so without JS (or <dialog> support) it simply opens the file.
(function () {
  var box = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  var caption = document.getElementById('lightbox-caption');
  var close = document.getElementById('lightbox-close');
  if (!box || typeof box.showModal !== 'function') return;

  document.querySelectorAll('.publications a.paper-img').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var thumb = link.querySelector('img');
      var title = link.parentNode.querySelector('.papertitle');
      img.src = link.getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      caption.textContent = title ? title.textContent.replace(/\s+/g, ' ').trim() : '';
      box.showModal();
    });
  });

  close.addEventListener('click', function () { box.close(); });
  img.addEventListener('click', function () { box.close(); });
  // Clicking the backdrop lands on the dialog element itself.
  box.addEventListener('click', function (e) {
    if (e.target === box) box.close();
  });
})();

// Recent news: size the box to show exactly the first few entries (rows
// wrap differently at each width, so this is measured, not fixed in CSS).
// The rest scroll; the always-visible scrollbar signals there is more.
(function () {
  var VISIBLE = 5;
  var view = document.querySelector('.news-viewport');
  if (!view) return;

  function fit() {
    var items = view.querySelectorAll('.news-item');
    if (items.length <= VISIBLE) {
      view.style.maxHeight = 'none';
      return;
    }
    var last = items[VISIBLE - 1];
    view.style.maxHeight = (last.offsetTop + last.offsetHeight - items[0].offsetTop) + 'px';
  }

  window.addEventListener('resize', fit);
  // Re-measure once web fonts land, since they change line wrapping.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();
})();

// Back-to-top button: shown once the reader has scrolled past the header.
(function () {
  var top = document.getElementById('to-top');
  if (!top) return;

  function update() {
    top.hidden = window.scrollY < 600;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  top.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo(0, 0);
  });
})();
