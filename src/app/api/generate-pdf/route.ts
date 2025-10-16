import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import puppeteerCore from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { generatePdfToken } from '@/lib/pdf-token'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    const lineName = searchParams.get('line_name')
    const containerType = searchParams.get('container_type')
    const currency = searchParams.get('currency')

    const isDev = process.env.NODE_ENV == 'development'
    console.log({ isDev })
    console.log({ env: process.env.NEXT_PUBLIC_APP_URL })
    // console.log({ type, lineName, containerType, currency })
    const baseUrl = isDev
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_APP_URL
    console.log({ baseUrl })

    // Generate a temporary token for PDF access
    const pdfToken = await generatePdfToken(id!, type!)

    const url =
      type == 'OFFER'
        ? baseUrl +
          `/download/offer/${id}?line_name=${lineName}&container_type=${containerType}&currency=${currency}&pdf_token=${pdfToken}`
        : baseUrl +
          `/download/confirmed-quote/${id}?currency=${currency}&pdf_token=${pdfToken}`
    console.log({ url })
    if (!id) return NextResponse.json('quote-id not found', { status: 400 })
    let browser
    if (isDev) {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
      const page = await browser.newPage()
      await page.goto(url, {
        waitUntil: 'networkidle0',
      })

      // console.log({html:await page.content()})

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
        content: `
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
    `,
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

      await browser.close()

      return new NextResponse(new Uint8Array(pdfBuffer).buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=estimate.pdf',
        },
      })
    } else {
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
        content: `
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
    `,
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

      await browser.close()

      return new NextResponse(new Uint8Array(pdfBuffer).buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=estimate.pdf',
        },
      })
    }
  } catch (error) {
    console.log('couldnt generate estimate pdf Error:', error)
    return NextResponse.json('Something went wrong couldnt generate pdf')
  }
}
