import puppeteer from "puppeteer";
import { writeFileSync } from "fs";
import { resolve } from "path";

export async function exportToPDF(
  htmlContent: string,
  outputPath: string,
  options?: { width?: number; height?: number }
): Promise<void> {
  const width = options?.width || 1280;
  const height = options?.height || 720;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    await page.evaluate(() => {
      return new Promise<void>((resolvePromise) => {
        const checkReady = () => {
          if (typeof Reveal !== "undefined" && Reveal.isReady()) {
            resolvePromise();
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      });
    });

    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      width: `${width}px`,
      height: `${height}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      pageRanges: "1-100",
    });

    const absolutePath = resolve(outputPath);
    writeFileSync(absolutePath, pdfBuffer);
  } finally {
    await browser.close();
  }
}

export async function exportToHTML(
  htmlContent: string,
  outputPath: string
): Promise<void> {
  const absolutePath = resolve(outputPath);
  writeFileSync(absolutePath, htmlContent, "utf-8");
}
