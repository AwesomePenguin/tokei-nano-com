# 時計奈野 Official Website

Official multilingual website for 時計奈野 (Tokei Nano), built with Hugo and deployed through GitHub Pages.

## Development

```powershell
hugo server
```

Pushes to `main` are deployed automatically to [tokeinano.com](https://tokeinano.com/).

## Music and past works

The homepage features the current single and counts down to **November 13, 2026
at midnight in each visitor's local time zone**. Its HyperFollow pre-save link is
shown before release; direct Spotify, Apple Music, and YouTube Music links become
available when the countdown ends.

Released work is collected under `/works/`, with one localized page per release
at `/works/<slug>/` (and the corresponding language-prefixed routes). Add future
releases as multilingual page bundles under `content/works/<slug>/`; keep the
homepage focused on the current single and move its previous release details into
this archive.

## AI creative statement

The statement is available at `/ai/` (Japanese), `/en/ai/` (English), and
`/zh-cn/ai/` (Simplified Chinese). English is the reference text. Content lives in
the multilingual [AI page bundle](content/ai).

The homepage footer link uses the release countdown and becomes visible at
**November 13, 2026, 00:00 in each visitor's local time zone**, including for visitors who leave the page open.
The pages themselves are published immediately, independently of the link timer;
they can be accessed directly and appear in the sitemap before that date.
With JavaScript disabled, the timed homepage link remains hidden.

To preview the revealed link locally, open `/?release-preview=1` (or the localized
homepage equivalent). This override only works on `localhost` and `127.0.0.1`.