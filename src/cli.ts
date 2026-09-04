#!/usr/bin/env node

import { Command } from "commander";
import { readFileSync, existsSync } from "fs";
import { resolve, basename, dirname } from "path";
import { parseMarkdown, parseFrontmatter, buildConfig } from "./parser.js";
import { generateHTML, getAvailableThemes } from "./converter.js";
import { exportToPDF, exportToHTML } from "./exporter.js";
import { startDevServer } from "./server.js";
import { getThemeDescriptions } from "./themes.js";
import { ConvertOptions } from "./types.js";

const program = new Command();

program
  .name("md2slides")
  .description("Universal Markdown to Slides Converter")
  .version("1.0.0");

program
  .command("convert <input>")
  .description("Convert a Markdown file to a presentation")
  .option("-o, --output <path>", "Output file path")
  .option("-t, --theme <name>", "Theme name (default, light, solarized, midnight, minimal, corporate)", "default")
  .option("-f, --format <format>", "Output format: html or pdf", "html")
  .option("--title <title>", "Presentation title")
  .option("--author <author>", "Author name")
  .option("--description <desc>", "Presentation description")
  .option("--transition <name>", "Slide transition effect", "slide")
  .option("--width <pixels>", "Slide width", "1280")
  .option("--height <pixels>", "Slide height", "720")
  .action(async (input: string, opts: Record<string, string>) => {
    const inputPath = resolve(input);
    if (!existsSync(inputPath)) {
      console.error(`Error: Input file not found: ${inputPath}`);
      process.exit(1);
    }

    const markdown = readFileSync(inputPath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(markdown);
    const config = buildConfig(frontmatter, {
      theme: opts.theme,
      title: opts.title,
      author: opts.author,
      description: opts.description,
      transition: opts.transition,
      width: parseInt(opts.width, 10),
      height: parseInt(opts.height, 10),
    });

    const slides = parseMarkdown(body);
    console.log(`  📊 Parsed ${slides.length} slides`);

    const html = generateHTML(slides, config);

    const format = opts.format || "html";
    const outputPath =
      opts.output ||
      resolve(dirname(inputPath), basename(inputPath, ".md") + (format === "pdf" ? ".pdf" : ".html"));

    if (format === "pdf") {
      console.log("  📄 Exporting to PDF...");
      await exportToPDF(html, outputPath, { width: config.width, height: config.height });
    } else {
      await exportToHTML(html, outputPath);
    }

    console.log(`  ✅ Output saved to: ${outputPath}`);
  });

program
  .command("serve <input>")
  .description("Start a dev server with live preview")
  .option("-p, --port <port>", "Port number", "3000")
  .option("-t, --theme <name>", "Theme name", "default")
  .option("--title <title>", "Presentation title")
  .option("--author <author>", "Author name")
  .option("--no-watch", "Disable file watching")
  .action(async (input: string, opts: Record<string, string | boolean>) => {
    const options = {
      input: resolve(input),
      port: parseInt(opts.port as string, 10),
      theme: opts.theme as string,
      title: opts.title as string,
      author: opts.author as string,
      watch: opts.watch !== false,
    };
    await startDevServer(options);
  });

program
  .command("themes")
  .description("List available themes")
  .action(() => {
    const themes = getThemeDescriptions();
    console.log("\n  Available themes:\n");
    for (const theme of themes) {
      console.log(`    ${theme.name.padEnd(15)} ${theme.description}`);
    }
    console.log("");
  });

program
  .command("init [name]")
  .description("Create a new presentation from a template")
  .option("-t, --theme <name>", "Theme name", "default")
  .action((name: string | undefined, opts: Record<string, string>) => {
    const fileName = name ? `${name}.md` : "presentation.md";
    const outputPath = resolve(fileName);

    if (existsSync(outputPath)) {
      console.error(`Error: File already exists: ${outputPath}`);
      process.exit(1);
    }

    const template = `---
title: ${name || "My Presentation"}
author: Your Name
description: A presentation created with md2slides
theme: ${opts.theme}
transition: slide
---

# Welcome to md2slides

Transform your Markdown into beautiful presentations.

<!-- notes: Start with a strong opening -->

---

## Features

- Markdown-based slides
- Mermaid diagram support
- PDF export
- Live preview server
- Multiple themes

---

## Two-Column Layout

Use \`|||\` to split content into columns.

|||

- Left column content
- Another point
- And another

---

## Code Highlighting

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet("World");
\`\`\`

---

## Mermaid Diagrams

\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\`

---

## Quotes

> "The best way to predict the future is to invent it."
> — Alan Kay

---

## Thank You!

Questions?

<!-- notes: Wrap up and invite questions -->
`;

    const { writeFileSync } = require("fs");
    writeFileSync(outputPath, template, "utf-8");
    console.log(`  ✅ Created: ${outputPath}`);
    console.log(`  Run: md2slides serve ${fileName}`);
  });

program.parse();
