# Women Teaching Worldwide

A worldwide community of women who teach mathematics and computer science at
university. This repository holds the community's website.

## What's here

```
build.py        the whole site generator — plain Python, no dependencies
templates/      base.html (shared layout) + one file per page
static/         stylesheet, scripts, images
docs/           the generated site (this is what gets published)
```

## Build it

```
python3 build.py
```

Then open `docs/index.html`, or serve it properly:

```
python3 -m http.server --directory docs 8000
```

and go to <http://localhost:8000>.

## Change things

**The name, tagline or contact address** — the `CONFIG` block at the top of
`build.py`. Change it there and it updates on every page.

**The pages** — edit the matching file in `templates/`. To add a page, create
`templates/newpage.html` and add a line to `PAGES` in `build.py`.

**Colours and type** — the `:root` block at the top of `static/style.css`.
Every colour on the site comes from those variables, and the dark-mode block
just below redefines them.

Run `python3 build.py` after any change.

## Publish it

GitHub Pages serves this repository straight from `docs/`:

1. Push to GitHub.
2. Repository → Settings → Pages.
3. Source: *Deploy from a branch*. Branch: `main`, folder: `/docs`. Save.
4. The site appears at `https://<username>.github.io/<repo>/` in a minute or two.

To use your own domain, add it under Settings → Pages → Custom domain, and
point the domain's DNS at GitHub as the instructions there describe.

## Still to do

- [ ] Create the community email address and put it in `CONFIG["CONTACT_EMAIL"]`
- [ ] Decide the final name (one line in `CONFIG`)
- [ ] Replace the offline join form with a real one (Tally or Framaforms) —
      see the comment at the top of `templates/join.html`
- [ ] Add a photo for Éloïse (`static/` + `templates/about.html`)
- [ ] Create the WhatsApp group and add the invite flow
