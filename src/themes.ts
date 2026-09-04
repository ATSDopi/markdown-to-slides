export interface Theme {
  name: string;
  revealTheme: string;
  customCSS: string;
  description: string;
}

const themes: Record<string, Theme> = {
  default: {
    name: "default",
    revealTheme: "black",
    description: "Clean dark theme with white text on black background",
    customCSS: `
    .reveal { font-family: 'Inter', 'Helvetica Neue', sans-serif; }
    .reveal h1 { font-size: 2.5em; font-weight: 800; text-transform: none; }
    .reveal h2 { font-size: 1.8em; font-weight: 700; text-transform: none; }
    .reveal h3 { font-size: 1.4em; font-weight: 600; text-transform: none; }
    .reveal p { font-size: 0.9em; line-height: 1.6; }
    .reveal code { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
    .reveal pre { font-size: 0.7em; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    .reveal .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 2em; }
    .reveal .two-column .col { text-align: left; }
    .reveal .title-slide h1 { font-size: 3em; margin-bottom: 0.5em; }
    .reveal .title-slide p { font-size: 1.2em; color: #aaa; }
    .reveal .section-slide { text-align: center; }
    .reveal .section-slide h1 { font-size: 2em; color: #42b3f4; }
    .reveal .quote-slide blockquote { font-size: 1.5em; font-style: italic; border: none; width: 80%; margin: 0 auto; }
    .reveal .mermaid { display: flex; justify-content: center; }
    .reveal .fragment { transition: all 0.4s ease; }
    .reveal .fragment.visible { opacity: 1; }
    .reveal .fragment:not(.visible) { opacity: 0.3; }`,
  },
  light: {
    name: "light",
    revealTheme: "white",
    description: "Bright theme with dark text on white background",
    customCSS: `
    .reveal { font-family: 'Inter', 'Helvetica Neue', sans-serif; color: #222; }
    .reveal h1 { font-size: 2.5em; font-weight: 800; text-transform: none; color: #1a1a1a; }
    .reveal h2 { font-size: 1.8em; font-weight: 700; text-transform: none; color: #333; }
    .reveal h3 { font-size: 1.4em; font-weight: 600; text-transform: none; color: #444; }
    .reveal p { font-size: 0.9em; line-height: 1.6; color: #555; }
    .reveal a { color: #2d7ff9; }
    .reveal code { font-family: 'JetBrains Mono', 'Fira Code', monospace; background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
    .reveal pre { font-size: 0.7em; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e0e0e0; }
    .reveal .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 2em; }
    .reveal .two-column .col { text-align: left; }
    .reveal .title-slide h1 { font-size: 3em; margin-bottom: 0.5em; }
    .reveal .title-slide p { font-size: 1.2em; color: #666; }
    .reveal .section-slide { text-align: center; }
    .reveal .section-slide h1 { font-size: 2em; color: #2d7ff9; }
    .reveal .quote-slide blockquote { font-size: 1.5em; font-style: italic; border: none; width: 80%; margin: 0 auto; color: #555; }
    .reveal .mermaid { display: flex; justify-content: center; }
    .reveal .fragment { transition: all 0.4s ease; }
    .reveal .fragment.visible { opacity: 1; }
    .reveal .fragment:not(.visible) { opacity: 0.3; }`,
  },
  solarized: {
    name: "solarized",
    revealTheme: "solarized",
    description: "Solarized color scheme — warm and readable",
    customCSS: `
    .reveal { font-family: 'Inter', 'Helvetica Neue', sans-serif; }
    .reveal h1 { font-size: 2.5em; font-weight: 800; text-transform: none; }
    .reveal h2 { font-size: 1.8em; font-weight: 700; text-transform: none; }
    .reveal p { font-size: 0.9em; line-height: 1.6; }
    .reveal code { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
    .reveal pre { font-size: 0.7em; }
    .reveal .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 2em; }
    .reveal .two-column .col { text-align: left; }
    .reveal .title-slide h1 { font-size: 3em; }
    .reveal .section-slide { text-align: center; }
    .reveal .section-slide h1 { font-size: 2em; color: #b58900; }
    .reveal .quote-slide blockquote { font-size: 1.5em; font-style: italic; border: none; width: 80%; margin: 0 auto; }
    .reveal .mermaid { display: flex; justify-content: center; }
    .reveal .fragment { transition: all 0.4s ease; }
    .reveal .fragment.visible { opacity: 1; }
    .reveal .fragment:not(.visible) { opacity: 0.3; }`,
  },
  midnight: {
    name: "midnight",
    revealTheme: "moon",
    description: "Deep midnight blue theme with soft accents",
    customCSS: `
    .reveal { font-family: 'Inter', 'Helvetica Neue', sans-serif; }
    .reveal h1 { font-size: 2.5em; font-weight: 800; text-transform: none; color: #82b3d9; }
    .reveal h2 { font-size: 1.8em; font-weight: 700; text-transform: none; color: #a0c4e0; }
    .reveal h3 { font-size: 1.4em; font-weight: 600; text-transform: none; color: #c0d8f0; }
    .reveal p { font-size: 0.9em; line-height: 1.6; color: #d0d8e0; }
    .reveal code { font-family: 'JetBrains Mono', 'Fira Code', monospace; color: #82b3d9; }
    .reveal pre { font-size: 0.7em; box-shadow: 0 4px 20px rgba(0,0,0,0.5); background: #1a1a2e; }
    .reveal .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 2em; }
    .reveal .two-column .col { text-align: left; }
    .reveal .title-slide h1 { font-size: 3em; margin-bottom: 0.5em; }
    .reveal .title-slide p { font-size: 1.2em; color: #8899aa; }
    .reveal .section-slide { text-align: center; }
    .reveal .section-slide h1 { font-size: 2em; color: #82b3d9; }
    .reveal .quote-slide blockquote { font-size: 1.5em; font-style: italic; border: none; width: 80%; margin: 0 auto; color: #c0d8f0; }
    .reveal .mermaid { display: flex; justify-content: center; }
    .reveal .fragment { transition: all 0.4s ease; }
    .reveal .fragment.visible { opacity: 1; }
    .reveal .fragment:not(.visible) { opacity: 0.3; }`,
  },
  minimal: {
    name: "minimal",
    revealTheme: "simple",
    description: "Minimalist theme — clean and distraction-free",
    customCSS: `
    .reveal { font-family: 'Inter', 'Helvetica Neue', sans-serif; }
    .reveal h1 { font-size: 2.5em; font-weight: 300; text-transform: none; letter-spacing: -0.02em; }
    .reveal h2 { font-size: 1.8em; font-weight: 300; text-transform: none; letter-spacing: -0.01em; }
    .reveal h3 { font-size: 1.4em; font-weight: 400; text-transform: none; }
    .reveal p { font-size: 0.9em; line-height: 1.8; font-weight: 300; }
    .reveal code { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.8em; }
    .reveal pre { font-size: 0.7em; box-shadow: none; border: 1px solid #ddd; }
    .reveal .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 2em; }
    .reveal .two-column .col { text-align: left; }
    .reveal .title-slide h1 { font-size: 3.5em; font-weight: 200; margin-bottom: 0.5em; }
    .reveal .title-slide p { font-size: 1.2em; font-weight: 300; }
    .reveal .section-slide { text-align: center; }
    .reveal .section-slide h1 { font-size: 2em; font-weight: 200; }
    .reveal .quote-slide blockquote { font-size: 1.5em; font-style: italic; border: none; width: 80%; margin: 0 auto; font-weight: 300; }
    .reveal .mermaid { display: flex; justify-content: center; }
    .reveal .fragment { transition: all 0.4s ease; }
    .reveal .fragment.visible { opacity: 1; }
    .reveal .fragment:not(.visible) { opacity: 0.2; }`,
  },
  corporate: {
    name: "corporate",
    revealTheme: "serif",
    description: "Professional corporate theme with serif typography",
    customCSS: `
    .reveal { font-family: 'Georgia', 'Times New Roman', serif; }
    .reveal h1 { font-size: 2.5em; font-weight: 700; text-transform: none; color: #1a365d; }
    .reveal h2 { font-size: 1.8em; font-weight: 600; text-transform: none; color: #2c5282; }
    .reveal h3 { font-size: 1.4em; font-weight: 600; text-transform: none; color: #2b6cb0; }
    .reveal p { font-size: 0.9em; line-height: 1.7; }
    .reveal code { font-family: 'JetBrains Mono', 'Courier New', monospace; }
    .reveal pre { font-size: 0.7em; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .reveal .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 2em; }
    .reveal .two-column .col { text-align: left; }
    .reveal .title-slide h1 { font-size: 3em; margin-bottom: 0.5em; }
    .reveal .title-slide p { font-size: 1.2em; color: #666; }
    .reveal .section-slide { text-align: center; }
    .reveal .section-slide h1 { font-size: 2em; color: #2c5282; }
    .reveal .quote-slide blockquote { font-size: 1.5em; font-style: italic; border: none; width: 80%; margin: 0 auto; }
    .reveal .mermaid { display: flex; justify-content: center; }
    .reveal .fragment { transition: all 0.4s ease; }
    .reveal .fragment.visible { opacity: 1; }
    .reveal .fragment:not(.visible) { opacity: 0.3; }`,
  },
};

export function getTheme(name: string): Theme {
  return themes[name] || themes.default;
}

export function getThemeNames(): string[] {
  return Object.keys(themes);
}

export function getThemeDescriptions(): { name: string; description: string }[] {
  return Object.entries(themes).map(([name, theme]) => ({
    name,
    description: theme.description,
  }));
}
