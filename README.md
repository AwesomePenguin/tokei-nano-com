# 時計奈野 Official Website

Official multilingual website for 時計奈野 (Tokei Nano), built with Hugo and deployed through GitHub Pages.

## Development

```powershell
hugo server
hugo --destination _build-check
node --test tests\works.test.mjs
```

Pushes to `main` are deployed automatically to [tokeinano.com](https://tokeinano.com/).

## Works and homepage

All publicly announced works, including upcoming releases, live in multilingual
page bundles under `content/works/<slug>/`. Each has its own page at
`/works/<slug>/`, `/en/works/<slug>/`, and `/zh-cn/works/<slug>/`. The `/works/`
index displays square covers in a grid, newest release first.
The index omits the social-links and production sections. SP3 uses
`/works/bohimei/`; the previous `/works/boshimei/` URLs redirect to it in each
language. English works can use `title_note` for romanization and translated
titles, shown alongside the original title on the homepage, work page, and grid.

The homepage automatically selects the published work with the latest
`release_at`. Set `params.featured_work` in `hugo.toml` to a work's `work_id`
(for example `hello-world`) to override this; leave it empty for automatic
selection. An unknown override fails the build rather than silently choosing
another work.

The homepage and individual work pages use the same
[`work.html` partial](layouts/partials/work.html) for the release block and song
introduction. Only the homepage adds a hero. Song content, release dates, images,
pre-save links, and platform links are maintained in the work bundle, not copied
into the homepage. Shared UI translations live in the homepage front matter;
social links, production information, and contact details use the shared layout.
Sharing a work always uses its permanent individual page URL.

### Adding a work

- Create `index.ja.md`, `index.en.md`, and `index.zh-cn.md` in its bundle, following
  the existing works.
- Use `date` for the public announcement/publication date (not the future release
  date). Hugo excludes drafts and future-dated content from normal builds.
- Set a unique `work_id` and an ISO `release_at`. Use a local datetime without an
  offset for listener-local midnight (SP3: `2026-11-13T00:00:00`); keep an explicit
  offset for a fixed worldwide instant (`hello world` retains its original UTC+8
  release time). Display text is localized separately in `release_date`.
- Set `cover_base` and `hero_base` to responsive image basenames. Covers use
  480/960/1440 widths and heroes use 960/1600/2400, in AVIF, WebP, and JPEG.
- Put the introduction in the Markdown body, with its heading in `story_title`
  and short summary in `description`.
- Add only available platform URLs. `presave_url` is optional; each `platforms`
  entry may contain a release-gated `listen_url` and/or an always-visible
  `artist_url`, with UI translation keys in `listen_label` and `artist_label`.

Countdowns, pre-save visibility, direct streaming links, and share text switch at
the work's release time on both surfaces, including for visitors who leave the
page open. With JavaScript disabled, streaming links remain locked.

To preview the released state locally, append `?release-preview=1` to the homepage
or a work page. This override only works on `localhost` and `127.0.0.1`.

## AI creative statement

The statement is available at `/ai/` (Japanese), `/en/ai/` (English), and
`/zh-cn/ai/` (Simplified Chinese). English is the reference text. Content lives in
the multilingual [AI page bundle](content/ai).

The statement and its footer link are public independently of the featured
work's countdown, so promoting another upcoming release does not hide it again.
