import { Slide, PresentationConfig } from "./types.js";
import { getTheme, getThemeNames } from "./themes.js";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function processTwoColumn(html: string): string {
  const parts = html.split("|||");
  if (parts.length === 2) {
    return `<div class="two-column"><div class="col">${parts[0].trim()}</div><div class="col">${parts[1].trim()}</div></div>`;
  }
  return html;
}

function processMermaid(html: string): string {
  return html.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (_, code) => `<div class="mermaid">${code}</div>`
  );
}

function processFragments(html: string): string {
  return html.replace(
    /<li>(?!\s*class="fragment")/g,
    '<li class="fragment">'
  ).replace(
    /(<p>(?:(?!class="fragment").)*?<\/p>)/g,
    (match) => {
      if (match.includes("class=")) return match;
      return match.replace("<p>", '<p class="fragment">');
    }
  );
}

function processSlideContent(slide: Slide, config: PresentationConfig): string {
  let html = slide.html;

  if (slide.layout === "two-column") {
    html = processTwoColumn(html);
  }

  html = processMermaid(html);

  if (slide.layout === "code") {
    html = html.replace(
      /<pre><code/g,
      '<pre><code class="hljs"'
    );
  }

  if (slide.layout === "quote") {
    html = `<blockquote class="quote-slide">${html.replace(/<blockquote>/g, "").replace(/<\/blockquote>/g, "")}</blockquote>`;
  }

  if (slide.layout === "section") {
    html = `<div class="section-slide">${html}</div>`;
  }

  return html;
}

function buildSlideAttributes(slide: Slide, config: PresentationConfig): string {
  const attrs: string[] = [];

  const transition = slide.transition || config.transition;
  attrs.push(`data-transition="${transition}"`);

  if (slide.background) {
    attrs.push(`data-background="${slide.background}"`);
  }

  if (slide.layout === "title") {
    attrs.push('class="title-slide"');
  } else if (slide.layout === "section") {
    attrs.push('class="section-slide"');
  } else if (slide.layout === "quote") {
    attrs.push('class="quote-slide"');
  }

  return attrs.join(" ");
}

function buildNotesHtml(notes: string | undefined): string {
  if (!notes) return "";
  return `<aside class="notes">${notes}</aside>`;
}

export function generateHTML(slides: Slide[], config: PresentationConfig): string {
  const theme = getTheme(config.theme);
  const slidesHtml = slides
    .map((slide) => {
      const content = processSlideContent(slide, config);
      const attrs = buildSlideAttributes(slide, config);
      const notes = buildNotesHtml(slide.notes);
      return `      <section ${attrs}>\n        ${content}\n        ${notes}\n      </section>`;
    })
    .join("\n\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(config.title)}</title>
  <meta name="author" content="${escapeHtml(config.author)}">
  <meta name="description" content="${escapeHtml(config.description)}">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reset.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/${theme.revealTheme}.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/highlight/monokai.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/notes/notes.css">
  <style>
${theme.customCSS}
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
${slidesHtml}
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/notes/notes.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/highlight/highlight.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/mermaid/mermaid.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/search/search.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/math/math.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/zoom/zoom.js"></script>
  <script>
    Reveal.initialize({
      controls: ${config.controls},
      progress: ${config.progress},
      slideNumber: ${config.slideNumber},
      hash: ${config.hash},
      overview: ${config.overview},
      center: ${config.center},
      touch: ${config.touch},
      loop: ${config.loop},
      rtl: ${config.rtl},
      keyboard: ${config.keyboard},
      width: ${config.width},
      height: ${config.height},
      margin: ${config.margin},
      minScale: ${config.minScale},
      maxScale: ${config.maxScale},
      autoSlide: ${config.autoSlide},
      backgroundTransition: '${config.backgroundTransition}',
      transition: '${config.transition}',
      pdfExport: ${config.pdfExport},
      plugins: [RevealNotes, RevealHighlight, RevealMermaid, RevealSearch, RevealMath, RevealZoom],
      mermaid: {
        theme: '${config.mermaid.theme}',
        scale: ${config.mermaid.scale},
        fontFamily: '${config.mermaid.fontFamily}',
      },
    });
  </script>
</body>
</html>`;
}

export function getAvailableThemes(): string[] {
  return getThemeNames();
}
