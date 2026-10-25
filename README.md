# Women Teaching Worldwide

A worldwide community of women who teach mathematics and computer science at
university — open to every career stage, every country, and every institution.

## Why this exists

Teaching is treated as a private responsibility. You prepare alone, you fail
alone, and you rarely see how anyone else does it. The questions it raises —
how to explain an abstract idea so that it lands, how to write a fair exam, how
to reach the student who has decided she is bad at mathematics — rarely have
one right answer, and they are not the questions you always feel free to ask
down the corridor.

It started with two women teaching in Paris, one in mathematics and one in
machine learning, who met at a teaching training programme and began having
lunch together once a week. They swapped exercises and exams, talked through
the lecture that hadn't worked, and found their teaching improved simply from
not doing it alone.

Two people cannot have all the answers. Fifty can have a great many. That is
the whole idea: bring more women to the table, across institutions, countries
and education systems, and let everyone take what works and give what works.

We pay particular attention to women who have fewer opportunities for
international collaboration and professional support. Good teaching does not
belong to one university, one country or one system.

## What this repository is

The community's website: four pages — a welcome, a Q&A, the story, and a way to
join — built by a small Python script with no dependencies.

```
build.py        the whole site generator — CONFIG block at the top
templates/      base.html (shared layout) + one file per page
static/         stylesheet, scripts, images
docs/           the generated site, which GitHub Pages serves
```

## Working on it

```
python3 build.py
python3 -m http.server --directory docs 8000
```

Then open <http://localhost:8000>.

The name, tagline, contact address, WhatsApp link and footer logo all live in
the `CONFIG` block at the top of `build.py` — change them there and they change
on every page. Page text lives in `templates/`. Colours and type are the
`:root` variables at the top of `static/style.css`, with the dark-mode block
just below. Run `python3 build.py` after any change, then commit and push;
GitHub Pages redeploys within a minute.

## Contributing

If you teach these subjects and want to help — with the site, the community, or
the organising — you are welcome. Open an issue, or join through the website
and say so.
