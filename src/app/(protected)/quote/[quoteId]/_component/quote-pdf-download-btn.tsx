'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'

export const QuotePdfDownloadBtn = ({ quoteId }: { quoteId: string }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const downloadPdf = async () => {
    setLoading(true)
    const response = await fetch(`/api/generate-pdf?quote-id=${quoteId}`, {
      cache: 'force-cache',
    })
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `estimate-${quoteId}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
    setLoading(false)
  }
  return (
    <Button
      variant="ghost"
      onClick={downloadPdf}
      className="mr-10 mt-10 self-end print:hidden"
      disabled={loading}
    >
      <Download />
    </Button>
  )
}
