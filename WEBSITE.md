# IoTWithRamim · Portfolio

Personal portfolio of **Sakiul Mowla Ramim**, Lead IoT Engineer (brand: IoTWithRamim).
It covers edge hardware, FreeRTOS firmware, industrial protocols and multi-tenant IoT platforms
across aquaculture, utilities, energy, agriculture and industry.

**Live site:** https://ramimiot.github.io/Portfolio/

It is a plain static site (HTML, CSS and vanilla JavaScript, no build step), hosted on GitHub Pages.

> The live telemetry console in the hero section is a **simulation**. It generates plausible
> sensor readings in the browser and is not connected to any real device or broker.

## File structure

```
Portfolio/
├── index.html                      # The whole site: all copy, sections and project cards
├── 404.html                        # Standalone "Page not found" page (served by GitHub Pages)
├── robots.txt                      # Allows all crawlers, points to the sitemap
├── sitemap.xml                     # Single-URL sitemap
├── .nojekyll                       # Tells GitHub Pages to serve files as-is (no Jekyll)
├── WEBSITE.md                      # This guide (README.md is the CV)
└── assets/
    ├── Sakiul_Mowla_Ramim_CV.pdf   # Downloadable CV
    ├── css/
    │   └── style.css               # All styles; theme colours are CSS variables at the top
    ├── js/
    │   └── main.js                 # Theme toggle, nav, project filters, simulated telemetry
    └── img/
        ├── favicon.svg             # "SR" brand mark
        └── og-image.png            # 1200x630 social preview image
```

## Preview locally

From the project folder:

```bash
python -m http.server
```

Then open http://localhost:8000 in your browser. (Opening `index.html` directly also works,
but a local server behaves more like GitHub Pages.)

## Publish to GitHub Pages

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/RamimIoT/Portfolio.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
choose branch **`main`** and folder **`/ (root)`**, and save.
The site appears at https://ramimiot.github.io/Portfolio/ within a minute or two.
Later updates go live automatically after each `git push`.

Because the site is served from a sub-path (`/Portfolio/`), keep asset links in `index.html`
**relative** (for example `assets/css/style.css`, not `/assets/css/style.css`).

## Editing content

- **Text and sections:** all copy lives in `index.html`. Edit it directly; there is no CMS or build step.
- **CV:** replace `assets/Sakiul_Mowla_Ramim_CV.pdf` with a new PDF of the same name and the
  download buttons keep working.
- **Theme colours:** the palette is defined as CSS variables at the top of `assets/css/style.css`
  (`:root[data-theme="dark"]` and `:root[data-theme="light"]`), for example `--accent`, `--accent-2`, `--bg`.
- **Social preview / favicon:** `assets/img/og-image.png` (1200x630) and `assets/img/favicon.svg`.

### Adding a project card

In `index.html`, find the `<ul class="project-grid" id="project-grid">` list, copy an existing
`<li class="project" data-cat="...">` block and edit it:

```html
<li class="project" data-cat="industry">
  <a href="https://example.com/case-study" target="_blank" rel="noopener">
    <span class="p-cat">Industrial</span>
    <h3>Project title</h3>
    <p>One or two sentences on what it does and your role.</p>
    <ul class="p-tags"><li>ESP32</li><li>Modbus</li><li>MQTT</li></ul>
    <span class="p-link">Case study <svg class="ico"><use href="#i-external"/></svg></span>
  </a>
</li>
```

`data-cat` controls which filter button shows the card. Available categories:

| `data-cat` | Filter button      |
|------------|--------------------|
| `aqua`     | Aquaculture        |
| `industry` | Industrial         |
| `city`     | Utilities & City   |
| `agri`     | Agriculture        |
| `safety`   | Health & Safety    |

A card can belong to several categories by separating them with a space, e.g. `data-cat="city safety"`.

## If the repository is renamed

If the repo is ever renamed to `RamimIoT.github.io`, the site moves to the root URL
`https://ramimiot.github.io/`. Update every absolute URL that contains `/Portfolio/`:

- `index.html`: canonical link, `og:url`, `og:image` and the JSON-LD `url`
- `404.html`: home links and favicon URL
- `robots.txt`: sitemap URL
- `sitemap.xml`: `<loc>`
