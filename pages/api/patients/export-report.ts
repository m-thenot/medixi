import { NextApiRequest, NextApiResponse } from "next";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

async function getBrowser() {
  return puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v122.0.0/chromium-v122.0.0-pack.tar`
    ),
    // @ts-ignore
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    const { html } = req.body;

    const htmlContent = `<main style="font-family: arial, helvetica, sans-serif;">${html}</main>`;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: 40, bottom: 40, left: 25, right: 25 },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Failed to generate PDF", { error });
    res.status(500).json({ message: "Failed to generate PDF", error });
  }
};
