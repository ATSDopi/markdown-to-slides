export interface Slide {
  id: string;
  title: string;
  content: string;
  html: string;
  layout: SlideLayout;
  notes?: string;
  transition?: string;
  background?: string;
  fragmentIndex?: number;
}

export type SlideLayout =
  | "title"
  | "content"
  | "two-column"
  | "image"
  | "quote"
  | "code"
  | "section"
  | "blank";

export interface PresentationConfig {
  title: string;
  author: string;
  description: string;
  theme: string;
  transition: string;
  controls: boolean;
  progress: boolean;
  slideNumber: boolean;
  hash: boolean;
  overview: boolean;
  center: boolean;
  touch: boolean;
  loop: boolean;
  rtl: boolean;
  keyboard: boolean;
  width: number;
  height: number;
  margin: number;
  minScale: number;
  maxScale: number;
  autoSlide: number;
  backgroundTransition: string;
  pdfExport: boolean;
  mermaid: MermaidConfig;
}

export interface MermaidConfig {
  theme: "default" | "dark" | "forest" | "neutral";
  scale: number;
  fontFamily: string;
}

export interface ConvertOptions {
  input: string;
  output?: string;
  theme?: string;
  format?: "html" | "pdf";
  watch?: boolean;
  port?: number;
  title?: string;
  author?: string;
  description?: string;
  transition?: string;
  width?: number;
  height?: number;
}

export const DEFAULT_CONFIG: PresentationConfig = {
  title: "Untitled Presentation",
  author: "",
  description: "",
  theme: "default",
  transition: "slide",
  controls: true,
  progress: true,
  slideNumber: true,
  hash: true,
  overview: true,
  center: true,
  touch: true,
  loop: false,
  rtl: false,
  keyboard: true,
  width: 1280,
  height: 720,
  margin: 0.1,
  minScale: 0.2,
  maxScale: 2.0,
  autoSlide: 0,
  backgroundTransition: "fade",
  pdfExport: false,
  mermaid: {
    theme: "default",
    scale: 1,
    fontFamily: "Arial, sans-serif",
  },
};
