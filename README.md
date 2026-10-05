# 時計奈野 Official Website

Official multilingual website for 時計奈野 (Tokei Nano), built with Hugo and deployed through GitHub Pages.

## Development

```powershell
hugo server
```

Pushes to `main` are deployed automatically to [tokeinano.com](https://tokeinano.com/).

## AI creative statement

The statement is available at `/ai/` (Japanese), `/en/ai/` (English), and
`/zh-cn/ai/` (Simplified Chinese). English is the reference text. Content lives in
the multilingual [AI page bundle](content/ai).

The homepage footer link uses the existing release countdown and becomes visible
at **October 9, 2026, 00:00 UTC+8**, including for visitors who leave the page open.
The pages themselves are published immediately, independently of the link timer;
they can be accessed directly and appear in the sitemap before that date.
With JavaScript disabled, the timed homepage link remains hidden.

To preview the revealed link locally, open `/?release-preview=1` (or the localized
homepage equivalent). This override only works on `localhost` and `127.0.0.1`.