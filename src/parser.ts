import { marked } from "marked";
import { Slide, SlideLayout, PresentationConfig, DEFAULT_CONFIG } from "./types.js";

let slideCounter = 0;

function generateId(): string {
  slideCounter++;
  return `slide-${slideCounter}`;
}

function detectLayout(content: string, lines: string[]): SlideLayout {
  const trimmed = content.trim();

  if (trimmed.startsWith("```") || trimmed.includes("```")) {
    return "code";
  }

  if (trimmed.startsWith("> ") && !trimmed.includes("\n> \n> ")) {
    return "quote";
  }

  if (trimmed.startsWith("![") && lines.length <= 2) {
    return "image";
  }

  if (trimmed.startsWith("---") && lines.length <= 1) {
    return "section";
  }

  if (trimmed.match(/^#{1}\s/) && lines.length <= 1) {
    return "title";
  }

  if (trimmed.includes("|||")) {
    return "two-column";
  }

  if (trimmed === "" || trimmed === "---") {
    return "blank";
  }

  return "content";
}

function extractNotes(content: string): { body: string; notes: string | undefined } {
  const notesMatch = content.match(/<!--\s*notes?:\s*([\s\S]*?)-->/i);
  if (notesMatch) {
    return {
      body: content.replace(notesMatch[0], "").trim(),
      notes: notesMatch[1].trim(),
    };
  }
  return { body: content, notes: undefined };
}

function extractSlideConfig(line: string): Partial<{ transition: string; background: string }> {
  const config: Partial<{ transition: string; background: string }> = {};
  const transitionMatch = line.match(/transition:\s*(\w+)/i);
  const bgMatch = line.match(/bg(?:ackground)?:\s*([#a-zA-Z0-9_-]+)/i);
  if (transitionMatch) config.transition = transitionMatch[1];
  if (bgMatch) config.background = bgMatch[1];
  return config;
}

export function parseMarkdown(markdown: string): Slide[] {
  slideCounter = 0;
  const slides: Slide[] = [];

  const normalizedMarkdown = markdown.replace(/\r\n/g, "\n");
  const rawSlides = normalizedMarkdown.split(/\n---\n/);

  for (const rawSlide of rawSlides) {
    const trimmed = rawSlide.trim();
    if (!trimmed) continue;

    const { body, notes } = extractNotes(trimmed);
    const lines = body.split("\n");

    let slideContent = body;
    let config: Partial<{ transition: string; background: string }> = {};

    const firstLine = lines[0] || "";
    if (firstLine.trim().startsWith("<!--") && firstLine.includes("slide:")) {
      config = extractSlideConfig(firstLine);
      slideContent = lines.slice(1).join("\n").trim();
    }

    const titleMatch = slideContent.match(/^#{1}\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : "Untitled Slide";

    const layout = detectLayout(slideContent, slideContent.split("\n"));
    const html = marked.parse(slideContent) as string;

    slides.push({
      id: generateId(),
      title,
      content: slideContent,
      html,
      layout,
      notes,
      transition: config.transition,
      background: config.background,
    });
  }

  return slides;
}

export function parseFrontmatter(markdown: string): { frontmatter: Partial<PresentationConfig>; body: string } {
  const fmMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    return { frontmatter: {}, body: markdown };
  }

  const fmText = fmMatch[1];
  const body = fmMatch[2];
  const frontmatter: Partial<PresentationConfig> = {};

  for (const line of fmText.split("\n")) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (!match) continue;
    const [, key, value] = match;
    const trimmedValue = value.trim().replace(/^["']|["']$/g, "");

    switch (key) {
      case "title":
      case "author":
      case "description":
      case "theme":
      case "transition":
      case "backgroundTransition":
        (frontmatter as Record<string, unknown>)[key] = trimmedValue;
        break;
      case "controls":
      case "progress":
      case "slideNumber":
      case "hash":
      case "overview":
      case "center":
      case "touch":
      case "loop":
      case "rtl":
      case "keyboard":
      case "pdfExport":
        (frontmatter as Record<string, unknown>)[key] = trimmedValue === "true";
        break;
      case "width":
      case "height":
      case "margin":
      case "minScale":
      case "maxScale":
      case "autoSlide":
        (frontmatter as Record<string, unknown>)[key] = parseInt(trimmedValue, 10);
        break;
    }
  }

  return { frontmatter, body };
}

export function buildConfig(
  frontmatter: Partial<PresentationConfig>,
  options?: Partial<PresentationConfig>
): PresentationConfig {
  return {
    ...DEFAULT_CONFIG,
    ...frontmatter,
    ...options,
    mermaid: {
      ...DEFAULT_CONFIG.mermaid,
      ...frontmatter.mermaid,
    },
  };
}
