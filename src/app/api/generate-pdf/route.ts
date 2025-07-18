import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import puppeteerCore from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { PdfType } from '@/types/common'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    const lineName = searchParams.get('line_name')
    const isDev = process.env.NODE_ENV == 'development'
    console.log({ isDev })
    console.log({ env: process.env.NEXT_PUBLIC_APP_URL })
    const baseUrl = isDev
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_APP_URL
    console.log({ baseUrl })
    const url =
      type == PdfType.OFFER
        ? baseUrl + `/download/offer/${id}?line_name=${lineName}`
        : baseUrl + `/download/confirmed-quote/${id}`
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
      await page.evaluate(() => {
        const bodyChildren = Array.from(document.body.children)
        bodyChildren.forEach((child) => {
          if (!child.matches('main') && child instanceof HTMLElement)
            child.style.display = 'none'
        })
      })

      await page.addStyleTag({
        content: `
        html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      main {
        transform: scale(0.90);
        transform-origin: center center;
      }
    `,
      })

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: false,
      })

      await browser.close()

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=estimate.pdf',
        },
      })
    } else {
      browser = await puppeteerCore.launch({
        headless: true,
        args: chromium.args,
        executablePath: await chromium.executablePath(),
      })
      const page = await browser.newPage()
      await page.goto(url, {
        waitUntil: 'networkidle0',
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
        html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      main {
        transform: scale(0.90);
        transform-origin: center center;
      }
    `,
      })

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: false,
      })

      await browser.close()

      return new NextResponse(pdfBuffer, {
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
