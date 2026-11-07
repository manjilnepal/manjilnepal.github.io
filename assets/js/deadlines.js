/* Conference deadlines page (miscellaneous/deadlines/).
   Reads window.DEADLINES (miscellaneous/deadlines/deadlines.js) and renders,
   top to bottom:
     1. Year summary: January–December for this year or next (tabs), each
        month listing the conferences whose paper deadline falls in it
        (passed, announced, or expected from the previous edition).
     2. Domain filter toggles (remembered per browser).
     3. Conference grid for the selected domains, in date order: a card per
        open round, and a card per TBA venue at its expected month.
   Dates only, no countdowns. Today's date is used just to pick each
   conference's next round and where the summary starts. */
(function () {
  'use strict';

  var data = window.DEADLINES;
  var root = document.getElementById('deadlines');
  if (!data || !root) return;

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];
  var STORE_KEY = 'dl-areas';
  var DATE_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/;

  var now = Date.now();
  var today = new Date(now);
  var thisYear = today.getFullYear();

  // ── Date helpers ──

  // "AoE" → -12h, "UTC" → 0, "UTC-4" / "UTC+5:30" → offset in minutes.
  function tzOffsetMin(tz) {
    if (!tz || tz === 'UTC' || tz === 'GMT') return 0;
    if (tz === 'AoE') return -720;
    var m = /^UTC([+-])(\d{1,2})(?::(\d{2}))?$/.exec(tz);
    if (!m) return 0;
    var mins = parseInt(m[2], 10) * 60 + parseInt(m[3] || '0', 10);
    return m[1] === '-' ? -mins : mins;
  }

  function parts(s) {
    var m = DATE_RE.exec(s || '');
    if (!m) return null;
    return { y: +m[1], m: +m[2] - 1, d: +m[3], hh: m[4] || '23', mm: m[5] || '59' };
  }

  function toEpoch(s, tz) {
    var p = parts(s);
    if (!p) return NaN;
    return Date.UTC(p.y, p.m, p.d, +p.hh, +p.mm) - tzOffsetMin(tz) * 6e4;
  }

  // "Nov 16" this year, "Jan 11, 2027" otherwise.
  function fmtDay(s) {
    var p = parts(s);
    if (!p) return s;
    return MONTHS[p.m] + ' ' + p.d + (p.y !== thisYear ? ', ' + p.y : '');
  }

  function fmtFull(s, tz) {
    var p = parts(s);
    return p ? MONTHS[p.m] + ' ' + p.d + ', ' + p.y + ', ' + p.hh + ':' + p.mm + ' ' + tz : s;
  }

  function fmtLocal(ms) {
    try {
      return new Date(ms).toLocaleString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
      });
    } catch (e) {
      return new Date(ms).toString();
    }
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // ── Model ──
  // One entry per conference. `next` is the first round still ahead; when
  // every round has passed the entry rolls over to the next edition (1 year
  // on, or `every` years for biennial venues) with an expected month.

  var entries = [];
  data.areas.forEach(function (area) {
    area.confs.forEach(function (conf) {
      var every = conf.every || 1;
      var rounds = (conf.deadlines || []).map(function (d, i) {
        return { d: d, paper: toEpoch(d.paper, conf.tz), abstract: d.abstract ? toEpoch(d.abstract, conf.tz) : null };
      }).sort(function (a, b) { return a.paper - b.paper; });
      rounds.forEach(function (r, i) {
        r.label = r.d.label || (rounds.length > 1 ? 'Round ' + (i + 1) : '');
      });
      var open = rounds.filter(function (r) { return r.paper > now; });
      var e = { conf: conf, area: area, rounds: open, allRounds: rounds, every: every, title: conf.name + ' ' + conf.year };

      if (!open.length) {
        var ref = null, years = every;
        if (rounds.length) {
          ref = rounds[0].d.paper;
          e.title = conf.name + ' ' + (conf.year + every);
        } else if (conf.last) {
          ref = conf.last.paper;
          years = conf.year - (conf.last.year || conf.year - every);
        }
        if (ref) {
          var p = parts(ref);
          e.expected = { y: p.y + years, m: p.m };
          e.last = ref;
        }
      }
      e.id = 'dl-' + slug(e.title);
      // Sort key: next announced deadline, else middle of the expected month.
      e.key = open.length ? open[0].paper
        : e.expected ? Date.UTC(e.expected.y, e.expected.m, 15) + 1e13
        : 9e15;
      entries.push(e);
    });
  });
  entries.sort(function (a, b) { return a.key - b.key || a.title.localeCompare(b.title); });

  // ── 1. Year summary ──
  // A January–December grid for the selected year (this year or next).
  // Each month lists the conferences with a paper deadline in it:
  //   passed    – a known deadline already behind us,
  //   announced – a known deadline still ahead,
  //   expected  – projected from the latest known edition (same month,
  //               `every` years later) while the real date is unknown.

  var YEARS = [thisYear, thisYear + 1];
  var summaryYear = thisYear;

  // Every known and projected paper deadline, as { e, y, m, at, kind, tip }.
  var occurrences = [];
  entries.forEach(function (e) {
    var conf = e.conf;
    var current = e.allRounds.map(function (r) {
      return { src: r.d.paper, at: r.paper, label: r.label, edition: conf.year };
    });
    var previous = conf.last ? [{
      src: conf.last.paper, at: toEpoch(conf.last.paper, conf.last.tz || conf.tz), label: '',
      edition: conf.last.year || conf.year - e.every
    }] : [];
    var known = current.concat(previous);
    known.forEach(function (k) {
      var p = parts(k.src);
      occurrences.push({
        e: e, y: p.y, m: p.m, at: k.at,
        kind: k.at <= now ? 'passed' : 'announced',
        tip: conf.name + ' ' + k.edition + (k.label ? ' (' + k.label + ')' : '') + ': paper ' + fmtFull(k.src, conf.tz)
      });
    });

    // Project the next edition from the latest known one. With announced
    // rounds that is `every` years on; with only last year's date it is the
    // current (unannounced) edition.
    var shift = e.allRounds.length ? e.every
      : conf.last ? conf.year - (conf.last.year || conf.year - e.every) : 0;
    var nextEdition = e.allRounds.length ? conf.year + e.every : conf.year;
    if (shift > 0) {
      (current.length ? current : previous).forEach(function (k) {
        var p = parts(k.src);
        occurrences.push({
          e: e, y: p.y + shift, m: p.m, at: Date.UTC(p.y + shift, p.m, p.d),
          kind: 'expected',
          tip: conf.name + ' ' + nextEdition + (k.label ? ' (' + k.label + ')' : '') +
            ': expected ' + MONTHS[p.m] + ' ' + (p.y + shift) + ', based on ' + fmtDay(k.src)
        });
      });
    }
  });

  var KIND_ORDER = { passed: 0, announced: 1, expected: 2 };

  var summarySec = el('section', 'section dl-year');

  function renderSummary() {
    summarySec.replaceChildren();
    var head = el('div', 'dl-year-head');
    head.appendChild(el('h2', null, 'Year at a glance'));
    var tabs = el('div', 'dl-year-tabs');
    tabs.setAttribute('role', 'group');
    tabs.setAttribute('aria-label', 'Year');
    YEARS.forEach(function (y) {
      var b = el('button', 'dl-year-tab', String(y));
      b.type = 'button';
      b.setAttribute('aria-pressed', String(y === summaryYear));
      b.addEventListener('click', function () {
        summaryYear = y;
        renderSummary();
      });
      tabs.appendChild(b);
    });
    head.appendChild(tabs);
    summarySec.appendChild(head);

    var grid = el('ol', 'dl-months');
    grid.setAttribute('aria-label', 'Deadlines in ' + summaryYear);
    for (var m = 0; m < 12; m++) {
      var isNow = summaryYear === thisYear && m === today.getMonth();
      var isPast = summaryYear < thisYear || (summaryYear === thisYear && m < today.getMonth());
      var li = el('li', 'dl-month' + (isNow ? ' dl-month-now' : '') + (isPast ? ' dl-month-past' : ''));
      var mh = el('div', 'dl-month-head');
      mh.appendChild(el('span', 'dl-month-name', MONTHS[m]));
      if (isNow) mh.appendChild(el('span', 'dl-month-year', 'this month'));
      li.appendChild(mh);

      var items = occurrences.filter(function (o) { return o.y === summaryYear && o.m === m; })
        .sort(function (a, b) { return KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.at - b.at; });
      var names = el('div', 'dl-month-items');
      var seen = {};
      items.forEach(function (o) {
        var key = o.e.conf.name;
        if (seen[key]) return;                      // one chip per venue per month
        seen[key] = true;
        var a = el('a', 'dl-chip dl-chip-' + o.kind, o.e.conf.name);
        a.href = '#' + o.e.id;
        a.title = o.tip;
        names.appendChild(a);
      });
      if (!items.length) names.appendChild(el('span', 'dl-month-empty', '—'));
      li.appendChild(names);
      grid.appendChild(li);
    }
    summarySec.appendChild(grid);

    var legend = el('p', 'dl-legend');
    legend.appendChild(el('span', 'dl-chip dl-chip-announced dl-key', 'Announced'));
    legend.appendChild(el('span', 'dl-chip dl-chip-expected dl-key', 'Expected'));
    legend.appendChild(el('span', 'dl-chip dl-chip-passed dl-key', 'Passed'));
    legend.appendChild(document.createTextNode('Expected dates are estimated from the previous edition.'));
    summarySec.appendChild(legend);
  }

  // ── 2. Domain filters ──

  var allIds = data.areas.map(function (a) { return a.id; });
  var active = loadActive();

  function loadActive() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (Array.isArray(saved)) {
        var valid = saved.filter(function (id) { return allIds.indexOf(id) !== -1; });
        if (valid.length) return valid;
      }
    } catch (e) { /* storage unavailable: show everything */ }
    return allIds.slice();
  }

  function saveActive() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(active)); } catch (e) { /* ignore */ }
  }

  var filters = el('div', 'dl-filters');
  filters.setAttribute('role', 'group');
  filters.setAttribute('aria-label', 'Filter conferences by domain');

  function renderFilters() {
    filters.replaceChildren();
    var allOn = active.length === allIds.length;
    var all = el('button', 'dl-filter', 'All');
    all.type = 'button';
    all.setAttribute('aria-pressed', String(allOn));
    all.addEventListener('click', function () { active = allIds.slice(); update(); });
    filters.appendChild(all);

    data.areas.forEach(function (area) {
      var on = !allOn && active.indexOf(area.id) !== -1;
      var b = el('button', 'dl-filter', area.name);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(on));
      b.addEventListener('click', function () {
        if (allOn) active = [area.id];               // first pick narrows to this domain
        else if (on) active = active.filter(function (id) { return id !== area.id; });
        else active = active.concat(area.id);
        if (!active.length) active = allIds.slice();
        update();
      });
      filters.appendChild(b);
    });
  }

  // ── 3. Conference list ──

  // One card per open round (so a multi-round venue appears in each month
  // it has a deadline), plus one card per TBA venue in its expected month.
  function listItems(shown) {
    var items = [];
    shown.forEach(function (e) {
      if (e.rounds.length) {
        e.rounds.forEach(function (r, i) {
          var p = parts(r.d.paper);
          items.push({ e: e, r: r, first: i === 0, y: p.y, m: p.m, at: r.paper });
        });
      } else {
        items.push({
          e: e, first: true,
          y: e.expected ? e.expected.y : null,
          m: e.expected ? e.expected.m : null,
          at: e.key
        });
      }
    });
    items.sort(function (a, b) {
      var ka = a.y == null ? 1e9 : a.y * 12 + a.m;
      var kb = b.y == null ? 1e9 : b.y * 12 + b.m;
      return ka - kb || (!!b.r - !!a.r) || a.at - b.at || a.e.title.localeCompare(b.e.title);
    });
    return items;
  }

  function card(it) {
    var e = it.e, r = it.r;
    var li = el('li', 'dl-card' + (r ? '' : ' dl-card-tba'));
    if (it.first) li.id = e.id;

    var date = el('div', 'dl-date');
    if (r) {
      var p = parts(r.d.paper);
      date.appendChild(el('span', 'dl-date-m', MONTHS[p.m]));
      date.appendChild(el('span', 'dl-date-d', String(p.d)));
      date.title = 'Paper deadline: ' + fmtFull(r.d.paper, e.conf.tz) + '\n' + fmtLocal(r.paper) + ' in your time zone';
    } else {
      date.appendChild(el('span', 'dl-date-m', e.expected ? MONTHS[e.expected.m] : '—'));
      date.appendChild(el('span', 'dl-date-d dl-date-tba', 'TBA'));
    }
    li.appendChild(date);

    var body = el('div', 'dl-body');
    var title = el('div', 'dl-title');
    var a = el('a', 'dl-name', e.title);
    a.href = e.conf.link;
    a.target = '_blank';
    a.rel = 'noopener';
    title.appendChild(a);
    body.appendChild(title);

    // Detail lines: deadline time, then round / abstract. TBA cards show
    // the previous edition's date (the date block already says TBA).
    var lines = [];
    if (r) {
      var pp = parts(r.d.paper);
      lines.push('Paper ' + pp.hh + ':' + pp.mm + ' ' + e.conf.tz);
      var bits = [];
      if (r.label) bits.push(r.label);
      if (r.abstract) bits.push((r.d.abstractLabel || 'Abstract') + ' ' + fmtDay(r.d.abstract));
      if (bits.length) lines.push(bits.join(' · '));
    } else if (e.last) {
      lines.push('Last: ' + MONTHS[parts(e.last).m] + ' ' + parts(e.last).d + ', ' + parts(e.last).y);
    } else {
      lines.push('Not announced');
    }
    lines.forEach(function (t) { body.appendChild(el('div', 'dl-sub', t)); });
    // Domain tag floats in the top-right corner: only the title line wraps
    // around it, the detail lines below get the full width.
    body.insertBefore(el('span', 'dl-tag', e.area.short || e.area.name), body.firstChild);
    li.appendChild(body);

    return li;
  }

  var listSec = el('section', 'section dl-list-sec');
  var listHead = el('h2', null, 'Conferences');
  var listCount = el('span', 'h2-note dl-h2-note');
  listHead.appendChild(listCount);
  var list = el('ul', 'dl-cards');

  function renderList() {
    var shown = entries.filter(function (e) { return active.indexOf(e.area.id) !== -1; });
    var open = shown.filter(function (e) { return e.rounds.length; }).length;
    listCount.textContent = shown.length + ' venues \u00b7 ' + open + ' open';
    list.replaceChildren();
    listItems(shown).forEach(function (it) { list.appendChild(card(it)); });
  }

  function update() {
    saveActive();
    renderFilters();
    renderList();
  }

  listSec.append(listHead, filters, list);
  root.replaceChildren(summarySec, listSec);
  renderSummary();
  update();

  var upd = document.getElementById('dl-updated');
  if (upd && data.updated) {
    var p = parts(data.updated);
    if (p) upd.textContent = MONTHS[p.m] + ' ' + p.d + ', ' + p.y;
  }
})();
