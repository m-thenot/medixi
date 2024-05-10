import chromium from "@sparticuz/chromium-min";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import { logger } from "src/services/logger";

export const maxDuration = 60;

async function getBrowser() {
  return puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.LOCAL_CHROMIUM ||
      (await chromium.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v122.0.0/chromium-v122.0.0-pack.tar`
      )),
    // @ts-ignore
    headless: chromium.headless,
    ignoreHTTPSErrors: true
  });
}

export const POST = async (request: Request) => {
  try {
    const browser = await getBrowser();

    const page = await browser.newPage();
    const { html } = await request.json();

    const htmlContent = `<main style="font-family: arial, helvetica, sans-serif;">${html}</main>`;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: 40, bottom: 40, left: 25, right: 25 }
    });

    await browser.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment"
      }
    });
  } catch (error) {
    logger.error("Failed to generate PDF", { error });

    return NextResponse.json(
      { message: "Failed to generate PDF", error },
      { status: 500 }
    );
  }
};
