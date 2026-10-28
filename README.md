# manjilnepal.github.io

Personal site, plain HTML/CSS/JS, served by GitHub Pages. No build step.

```
index.html            Home (bio, experience, publications, achievements, projects)
miscellaneous/         Life outside research (miscellaneous/index.html)
data/                 CV and bio (kept at a stable URL, linked externally)
assets/
  css/style.css       All styles, themed via CSS variables
  js/home.js          Home only: Human/AI toggle, figure lightbox, news box
                      (shows the five newest, rest scroll) and back-to-top
  img/<section>/      Images, grouped by the section that uses them
  img/originals/      Full-size source PNGs (pages use the .webp copies)
```

Preview locally: `python3 -m http.server` then open http://localhost:8000.
