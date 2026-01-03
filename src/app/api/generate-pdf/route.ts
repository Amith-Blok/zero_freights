import { NextRequest, NextResponse } from 'next/server'
import { generatePdfToken } from '@/lib/pdf-token'
import { getPdfBufferFromUrl } from './helper'
import { PDFDocument } from 'pdf-lib'

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

    let url = ''
    const termsUrl = baseUrl + `/download/terms?pdf_token=${pdfToken}`

    switch (type) {
      case 'OFFER':
        url =
          baseUrl +
          `/download/offer/${id}?line_name=${lineName}&container_type=${containerType}&currency=${currency}&pdf_token=${pdfToken}`
        break
      case 'CONFIRMED_QUOTE':
        url =
          baseUrl +
          `/download/confirmed-quote/${id}?currency=${currency}&pdf_token=${pdfToken}`
        break
      default:
        return NextResponse.json('invalid type', { status: 400 })
    }

    console.log({ url })
    if (!id) return NextResponse.json('quote-id not found', { status: 400 })

    const mainArrayBuffer = await getPdfBufferFromUrl({ url: url })
    const termsArrayBuffer = await getPdfBufferFromUrl({ url: termsUrl })

    const mergePdf = await PDFDocument.create()
    const mainPdf = await PDFDocument.load(mainArrayBuffer)
    const termsPdf = await PDFDocument.load(termsArrayBuffer)

    const mainPages = await mergePdf.copyPages(
      mainPdf,
      mainPdf.getPageIndices()
    )
    const termsPages = await mergePdf.copyPages(
      termsPdf,
      termsPdf.getPageIndices()
    )

    mainPages.forEach((page) => {
      mergePdf.addPage(page)
    })

    termsPages.forEach((page) => {
      mergePdf.addPage(page)
    })

    const pdfBytes = await mergePdf.save()
    const arrayBuffer = new Uint8Array(pdfBytes).buffer

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=estimate.pdf',
      },
    })
  } catch (error) {
    console.log('couldnt generate estimate pdf Error:', error)
    return NextResponse.json('Something went wrong couldnt generate pdf')
  }
}
