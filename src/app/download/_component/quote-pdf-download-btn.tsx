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
      variant="outline"
      onClick={downloadPdf}
      className="ml-2 h-6 gap-1 border-green-200 text-green-700 print:hidden"
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
