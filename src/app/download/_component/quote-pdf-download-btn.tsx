'use client'

import { Button } from '@/components/ui/button'
import { PdfType } from '@/types/common'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'

export const QuotePdfDownloadBtn = ({
  id,
  type,
  lineName,
}: {
  id: string
  type: PdfType
  lineName?: string
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const downloadPdf = async () => {
    setLoading(true)
    const response = await fetch(
      `/api/generate-pdf?id=${id}&type=${type}${lineName ? `&line_name=${lineName}` : ''}`,
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
      variant="ghost"
      onClick={downloadPdf}
      className="print:hidden"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  )
}
