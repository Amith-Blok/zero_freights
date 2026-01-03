import puppeteer from 'puppeteer'
import puppeteerCore, { Browser } from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export const getPdfBufferFromUrl = async (params: {
  url: string
}): Promise<ArrayBuffer> => {
  const { url } = params
  const isDev = process.env.NODE_ENV == 'development'
  let browser: Browser

  if (isDev) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.goto(url, {
      waitUntil: 'networkidle0',
    })

    // Wait for fonts to load
    await page.evaluateOnNewDocument(() => {
      document.fonts.ready.then(() => {
        console.log('All fonts loaded')
      })
    })
    await page.evaluate(() => {
      const bodyChildren = Array.from(document.body.children)
      bodyChildren.forEach((child) => {
        if (!child.matches('main') && child instanceof HTMLElement)
          child.style.display = 'none'
      })
    })

    await page.addStyleTag({
      content: STYLE_TAG_CONTENT,
    })

    // Wait for fonts to be fully loaded before generating PDF
    await page.evaluate(async () => {
      await document.fonts.ready
      // Additional wait to ensure currency symbols are rendered
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: false,
    })
    return new Uint8Array(pdfBuffer).buffer
  }
  browser = await puppeteerCore.launch({
    headless: true,
    args: [
      ...chromium.args,
      '--font-render-hinting=none',
      '--disable-font-subpixel-positioning',
      '--disable-features=VizDisplayCompositor',
    ],
    executablePath: await chromium.executablePath(),
  })
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle0',
  })

  // Wait for fonts to load
  await page.evaluateOnNewDocument(() => {
    document.fonts.ready.then(() => {
      console.log('All fonts loaded')
    })
  })
  await page.evaluate(() => {
    const bodyChildren = Array.from(document.body.children)
    bodyChildren.forEach((child) => {
      if (!child.matches('main') && child instanceof HTMLElement)
        child.style.display = 'none'
    })
  })

  await page.addStyleTag({
    content: STYLE_TAG_CONTENT,
  })

  // Wait for fonts to be fully loaded before generating PDF
  await page.evaluate(async () => {
    await document.fonts.ready
    // Additional wait to ensure currency symbols are rendered
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: false,
  })
  return new Uint8Array(pdfBuffer).buffer
}

const STYLE_TAG_CONTENT = `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&display=swap');
        
        html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      main {
        transform: scale(0.90);
        transform-origin: center center;
      }
      * {
        font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
    `
