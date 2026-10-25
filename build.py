#!/usr/bin/env python3
"""
Static site builder — no dependencies, Python 3.8+.

    python3 build.py

Reads templates/ and static/, writes the finished site to docs/
(docs/ is the folder GitHub Pages can serve directly).

Everything you are likely to change is in CONFIG below.
"""

import datetime
import pathlib
import shutil

# ---------------------------------------------------------------- CONFIG

CONFIG = {
    # The community's name. Change it here and it changes everywhere.
    "SITE_NAME": "Women Teaching Worldwide",

    # Shown under the name, in the footer, and as the page description
    # that search engines and link previews use.
    "TAGLINE": "Open to every woman teaching mathematics and computer science at university.",

    # The closing line in the footer. <em> is styled in the accent colour.
    "SIGNOFF": "The table is getting bigger, and there is <em>room for you.</em>",

    # The community email address. Create a dedicated one — not a personal
    # or institutional address. Until then this placeholder is shown.
    "CONTACT_EMAIL": "A community address is being set up — please use the form above.",

    # Paste the WhatsApp group invite link here to show a join button on the
    # join page (WhatsApp -> Group info -> Invite via link -> Copy link).
    # Leave it empty and no button is shown.
    "WHATSAPP_LINK": "",

    # Optional logo in the footer (an institution or partner).
    # Put the file in static/ and name it here, e.g. "psl-logo.svg".
    # Leave LOGO_FILE empty and nothing is shown.
    "LOGO_FILE": "psl-logo.png",
    "LOGO_ALT": "Université PSL",
    "LOGO_LINK": "https://psl.eu",
    "LOGO_CAPTION": "Started at Université PSL, Paris",
}

# Pages, in navigation order: (output file, template file, nav label, page title)
PAGES = [
    ("index.html", "index.html", "Home",  "A worldwide community of women who teach"),
    ("qa.html",    "qa.html",    "Q&A",   "Questions & answers"),
    ("about.html", "about.html", "About", "How it started"),
    ("join.html",  "join.html",  "Join",  "Join the community"),
]

# ------------------------------------------------------------- BUILD

ROOT = pathlib.Path(__file__).parent
TEMPLATES = ROOT / "templates"
STATIC = ROOT / "static"
OUT = ROOT / "docs"


def nav_html(current):
    """Navigation links, with the current page marked for CSS and screen readers."""
    parts = []
    for out_name, _tpl, label, _title in PAGES:
        mark = ' aria-current="page"' if out_name == current else ""
        parts.append('<a href="{}"{}>{}</a>'.format(out_name, mark, label))
    return "".join(parts)


def brand_html(name):
    """Colour the last word of the name in the accent colour."""
    words = name.split()
    if len(words) < 2:
        return name
    return "{} <span>{}</span>".format(" ".join(words[:-1]), words[-1])


def whatsapp_card():
    """The WhatsApp join card - rendered only once a group link is configured."""
    link = CONFIG.get("WHATSAPP_LINK", "").strip()
    if not link:
        return ""
    return (
        '      <div class="contact-card">\n'
        '        <h3>Already invited?</h3>\n'
        "        <p>If we've sent you the invitation, this is the door.</p>\n"
        '        <p style="margin-top:.9rem">'
        '<a class="btn btn-primary" href="{}" rel="noopener">Open the WhatsApp group</a></p>\n'
        '      </div>\n'
    ).format(link)


def partner_logo():
    """Optional logo block in the footer."""
    name = CONFIG.get("LOGO_FILE", "").strip()
    if not name:
        return ""
    alt = CONFIG.get("LOGO_ALT", "") or "Logo"
    img = '<img class="partner-logo" src="static/{}" alt="{}">'.format(name, alt)
    link = CONFIG.get("LOGO_LINK", "").strip()
    if link:
        img = '<a href="{}" rel="noopener">{}</a>'.format(link, img)
    caption = CONFIG.get("LOGO_CAPTION", "").strip()
    cap = '<p class="logo-caption">{}</p>'.format(caption) if caption else ""
    return '    <div class="partner">{}{}</div>\n'.format(img, cap)


def fill(text, values):
    for key, value in values.items():
        text = text.replace("{{" + key + "}}", value)
    return text


def build():
    base = (TEMPLATES / "base.html").read_text(encoding="utf-8")

    OUT.mkdir(parents=True, exist_ok=True)
    # Files are overwritten in place rather than wiping docs/ first, so the
    # build works even where the folder can't be deleted (synced drives, etc).
    shutil.copytree(STATIC, OUT / "static", dirs_exist_ok=True)
    # Tell GitHub Pages not to run Jekyll over the output.
    (OUT / ".nojekyll").write_text("", encoding="utf-8")

    for out_name, tpl_name, _label, page_title in PAGES:
        body = (TEMPLATES / tpl_name).read_text(encoding="utf-8")
        values = dict(CONFIG)
        values.update({
            "PAGE_TITLE": page_title,
            "SITE_NAME_HTML": brand_html(CONFIG["SITE_NAME"]),
            "NAV": nav_html(out_name),
            "YEAR": str(datetime.date.today().year),
        })
        # Fill the page body first, then drop it into the shared layout.
        values["WHATSAPP_CARD"] = whatsapp_card()
        values["PARTNER_LOGO"] = partner_logo()
        values["CONTENT"] = fill(body, values)
        (OUT / out_name).write_text(fill(base, values), encoding="utf-8")
        print("built docs/{}".format(out_name))

    print("\nDone. Open docs/index.html in a browser, or run:")
    print("    python3 -m http.server --directory docs 8000")


if __name__ == "__main__":
    build()
