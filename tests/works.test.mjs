import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(path.join(tmpdir(), "tokei-works-test-"));
const languages = ["", "en", "zh-cn"];

function build(name, featuredWork = "") {
  const destination = path.join(output, name);
  const args = ["--destination", destination];
  if (featuredWork) {
    const config = path.join(output, `${name}.toml`);
    writeFileSync(config, `[params]\nfeatured_work = ${JSON.stringify(featuredWork)}\n`);
    args.push("--config", `${path.join(root, "hugo.toml")},${config}`);
  }
  const result = spawnSync("hugo", args, {
    cwd: root,
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  return { ...result, destination };
}

function html(destination, ...segments) {
  return readFileSync(path.join(destination, ...segments, "index.html"), "utf8");
}

function fragment(source, start, end) {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1);
  const endIndex = source.indexOf(end, startIndex);
  assert.notEqual(endIndex, -1);
  return source.slice(startIndex, endIndex);
}

let standard;
before(() => {
  standard = build("standard");
  assert.equal(standard.status, 0, standard.stdout + standard.stderr);
});
after(() => rmSync(output, { recursive: true, force: true }));

test("all languages share the latest work's release data and introduction", () => {
  for (const language of languages) {
    const home = html(standard.destination, language);
    const work = html(standard.destination, language, "works", "bohimei");
    assert.match(home, /data-work="bohimei"/);
    assert.match(home, /class="hero"/);
    assert.doesNotMatch(work, /class="hero"/);
    assert.match(work, /<h1 id="release-title">墓碑銘<\/h1>/);
    assert.equal(
      fragment(home, '<div class="release-countdown"', '<div class="share-action">'),
      fragment(work, '<div class="release-countdown"', '<div class="share-action">'),
    );
    assert.equal(
      fragment(home, '<section class="song-story"', '</section>'),
      fragment(work, '<section class="song-story"', '</section>'),
    );
    const prefix = language ? `${language}/` : "";
    assert.ok(home.includes(`data-share-url="https://tokeinano.com/${prefix}works/bohimei/"`));
    assert.match(work, /data-release-at="2026-11-13T00:00:00"/);
    assert.match(work, /hyperfollow\/b17afa7\/TnSTHNMevQm/);
    assert.match(work, /href="https:\/\/www.youtube.com\/channel\/UC5Mh4QhLUjsADBSxrZg5r4Q"/);
    const alias = html(standard.destination, language, "works", "boshimei");
    assert.ok(alias.includes(`https://tokeinano.com/${prefix}works/bohimei/`));
  }
});

test("cover grid includes upcoming and released works, ordered by release", () => {
  for (const language of languages) {
    const index = html(standard.destination, language, "works");
    assert.equal((index.match(/class="work-card reveal"/g) || []).length, 2);
    assert.ok(index.indexOf("works/bohimei/") < index.indexOf("works/hello-world/"));
    assert.doesNotMatch(index, /class="about"|class="credits"/);
    assert.match(html(standard.destination, language, "works", "bohimei"), /class="about"/);
    assert.match(index, /sp3-cover-960.jpg/);
    assert.match(index, /hello-world-cover-960.jpg/);
    const oldWork = html(standard.destination, language, "works", "hello-world");
    assert.match(oldWork, /data-release-at="2026-10-09T00:00:00(?:\+|&#43;)08:00"/);
    assert.match(oldWork, /album\/4oVGEkeK2NIf6gkYfdeK84/);
    assert.doesNotMatch(oldWork, /data-presave-link/);
  }
});

test("manual override changes homepage content, hero, metadata, and share target only", () => {
  const overridden = build("override", "hello-world");
  assert.equal(overridden.status, 0, overridden.stdout + overridden.stderr);
  for (const language of languages) {
    const home = html(overridden.destination, language);
    assert.match(home, /data-work="hello-world"/);
    assert.match(home, /images\/tokei-nano-hero-1600.jpg/);
    assert.match(home, /og:image" content="https:\/\/tokeinano.com\/images\/hello-world-cover-1440.jpg"/);
    assert.match(home, /data-share-url="https:\/\/tokeinano.com\/(?:en\/|zh-cn\/)?works\/hello-world\/"/);
    assert.match(html(overridden.destination, language, "works", "bohimei"), /data-work="bohimei"/);
  }
});

test("unknown manual override fails explicitly", () => {
  const invalid = build("invalid", "missing-work");
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stdout + invalid.stderr, /must match exactly one published work/);
});

test("localized SP3 copy and English title annotation appear on both surfaces", () => {
  for (const language of languages) {
    for (const segments of [[language], [language, "works", "bohimei"]]) {
      const page = html(standard.destination, ...segments);
      assert.doesNotMatch(page, /自行车看起来变小了|照片早已在墙上微笑|悼念的不是|the bicycle looks smaller|a photograph is already smiling|memorial to youth|小さく見える自転車|壁の中ですでに笑う写真|この曲が弔う/);
      if (language === "en") {
        assert.match(page, /class="work-title-note">Bohimei — Epitaph/);
        if (segments.length === 1) {
          assert.match(page, /The tomorrows we shared became the snow field of memories\./);
        }
      } else {
        assert.ok(page.includes(language === "zh-cn" ? "事前预约" : "事前予約"));
      }
    }
  }
});
