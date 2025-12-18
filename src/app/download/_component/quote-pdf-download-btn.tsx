'use client'

import { Button } from '@/components/ui/button'
import { PdfType } from '@/types/common'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'

export const QuotePdfDownloadBtn = ({
  id,
  type,
  lineName,
  containerType,
  currency,
}: {
  id: string
  type: PdfType
  lineName?: string
  containerType?: string
  currency: 'INR' | 'USD'
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const downloadPdf = async () => {
    setLoading(true)
    const response = await fetch(
      `/api/generate-pdf?id=${id}&type=${type}&currency=${currency}${lineName ? `&line_name=${lineName}&container_type=${containerType}` : ''}`,
      {
        cache: 'force-cache',
      }
    )
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `estimate-${id}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
    setLoading(false)
  }
  return (
    <Button
      variant="default"
      onClick={downloadPdf}
      className="ml-2 h-6 gap-1 border-green-200 bg-green-600 hover:bg-green-500 print:hidden"
      disabled={loading}
    >
      <span className="text-xs">Download</span>

      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Download className="h-3 w-3" />
      )}
    </Button>
  )
}
