import { describe, it, expect } from "vitest";
import { parseMarkdown, parseFrontmatter, buildConfig } from "../src/parser.js";
import { DEFAULT_CONFIG } from "../src/types.js";

describe("parseMarkdown", () => {
  it("should parse a single slide", () => {
    const md = "# Hello World\n\nThis is a slide.";
    const slides = parseMarkdown(md);
    expect(slides).toHaveLength(1);
    expect(slides[0].title).toBe("Hello World");
    expect(slides[0].layout).toBe("title");
  });

  it("should parse multiple slides separated by ---", () => {
    const md = "# Slide 1\n\nContent 1\n---\n# Slide 2\n\nContent 2";
    const slides = parseMarkdown(md);
    expect(slides).toHaveLength(2);
    expect(slides[0].title).toBe("Slide 1");
    expect(slides[1].title).toBe("Slide 2");
  });

  it("should detect code layout", () => {
    const md = "## Code Example\n\n```javascript\nconsole.log('hello');\n```";
    const slides = parseMarkdown(md);
    expect(slides[0].layout).toBe("code");
  });

  it("should detect quote layout", () => {
    const md = "> This is a quote";
    const slides = parseMarkdown(md);
    expect(slides[0].layout).toBe("quote");
  });

  it("should detect two-column layout", () => {
    const md = "## Columns\n\nLeft content ||| Right content";
    const slides = parseMarkdown(md);
    expect(slides[0].layout).toBe("two-column");
  });

  it("should extract speaker notes", () => {
    const md = "# Title\n\nContent\n<!-- notes: Remember to mention this -->";
    const slides = parseMarkdown(md);
    expect(slides[0].notes).toBe("Remember to mention this");
  });

  it("should handle empty slides", () => {
    const md = "# Slide 1\n\nContent\n---\n\n---\n# Slide 3";
    const slides = parseMarkdown(md);
    expect(slides.length).toBeGreaterThanOrEqual(2);
  });

  it("should generate unique IDs", () => {
    const md = "# Slide 1\n---\n# Slide 2";
    const slides = parseMarkdown(md);
    expect(slides[0].id).not.toBe(slides[1].id);
  });

  it("should parse slide-level config from comments", () => {
    const md = "<!-- slide: transition: fade bg: #ff0000 -->\n# Custom Slide";
    const slides = parseMarkdown(md);
    expect(slides[0].transition).toBe("fade");
    expect(slides[0].background).toBe("#ff0000");
  });
});

describe("parseFrontmatter", () => {
  it("should parse frontmatter", () => {
    const md = `---
title: My Talk
author: Jane Doe
theme: light
---

# Content`;
    const { frontmatter, body } = parseFrontmatter(md);
    expect(frontmatter.title).toBe("My Talk");
    expect(frontmatter.author).toBe("Jane Doe");
    expect(frontmatter.theme).toBe("light");
    expect(body).toContain("# Content");
  });

  it("should handle markdown without frontmatter", () => {
    const md = "# Just content";
    const { frontmatter, body } = parseFrontmatter(md);
    expect(frontmatter).toEqual({});
    expect(body).toBe("# Just content");
  });

  it("should parse boolean values", () => {
    const md = `---
controls: false
loop: true
---

# Content`;
    const { frontmatter } = parseFrontmatter(md);
    expect(frontmatter.controls).toBe(false);
    expect(frontmatter.loop).toBe(true);
  });

  it("should parse numeric values", () => {
    const md = `---
width: 1920
height: 1080
---

# Content`;
    const { frontmatter } = parseFrontmatter(md);
    expect(frontmatter.width).toBe(1920);
    expect(frontmatter.height).toBe(1080);
  });
});

describe("buildConfig", () => {
  it("should merge configs with defaults", () => {
    const config = buildConfig({ title: "Custom" });
    expect(config.title).toBe("Custom");
    expect(config.controls).toBe(DEFAULT_CONFIG.controls);
  });

  it("should override defaults with frontmatter", () => {
    const config = buildConfig({ controls: false, loop: true });
    expect(config.controls).toBe(false);
    expect(config.loop).toBe(true);
  });

  it("should override frontmatter with options", () => {
    const config = buildConfig({ theme: "light" }, { theme: "dark" });
    expect(config.theme).toBe("dark");
  });
});
