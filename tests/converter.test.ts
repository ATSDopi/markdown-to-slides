import { describe, it, expect } from "vitest";
import { parseMarkdown } from "../src/parser.js";
import { generateHTML } from "../src/converter.js";
import { buildConfig } from "../src/parser.js";

describe("generateHTML", () => {
  it("should generate valid HTML", () => {
    const slides = parseMarkdown("# Title\n\nContent");
    const config = buildConfig({});
    const html = generateHTML(slides, config);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
  });

  it("should include reveal.js", () => {
    const slides = parseMarkdown("# Title");
    const config = buildConfig({});
    const html = generateHTML(slides, config);
    expect(html).toContain("reveal.js");
  });

  it("should include slide content", () => {
    const slides = parseMarkdown("# My Test Slide\n\nHello World");
    const config = buildConfig({});
    const html = generateHTML(slides, config);
    expect(html).toContain("My Test Slide");
    expect(html).toContain("Hello World");
  });

  it("should include speaker notes", () => {
    const slides = parseMarkdown("# Title\n\nContent\n<!-- notes: Important note -->");
    const config = buildConfig({});
    const html = generateHTML(slides, config);
    expect(html).toContain("Important note");
    expect(html).toContain('class="notes"');
  });

  it("should apply theme CSS", () => {
    const slides = parseMarkdown("# Title");
    const config = buildConfig({ theme: "light" });
    const html = generateHTML(slides, config);
    expect(html).toContain("white.css");
  });

  it("should process mermaid blocks", () => {
    const md = "## Diagram\n\n```mermaid\ngraph TD\n  A --> B\n```";
    const slides = parseMarkdown(md);
    const config = buildConfig({});
    const html = generateHTML(slides, config);
    expect(html).toContain('class="mermaid"');
  });

  it("should process two-column layouts", () => {
    const md = "## Columns\n\nLeft ||| Right";
    const slides = parseMarkdown(md);
    const config = buildConfig({});
    const html = generateHTML(slides, config);
    expect(html).toContain("two-column");
  });

  it("should include config values", () => {
    const slides = parseMarkdown("# Title");
    const config = buildConfig({ controls: false, loop: true });
    const html = generateHTML(slides, config);
    expect(html).toContain("controls: false");
    expect(html).toContain("loop: true");
  });
});
