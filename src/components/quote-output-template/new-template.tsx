'use client'
import Image from 'next/image'

interface NewQuoteTemplateProps {
  children: React.ReactNode
  placeOfSupply: string
  subject: string
  validFrom: string
  validTo: string
  billTo: {
    name: string
    company: string
    address: string
  }
  shipTo: string
  blok_quoteId: string
}

export const NewQuoteTemplate = ({
  children,
  placeOfSupply,
  subject,
  validFrom,
  validTo,
  billTo,
  shipTo,
  blok_quoteId,
}: NewQuoteTemplateProps) => {
  return (
    <div
      className="mx-auto my-4 bg-white shadow-md"
      style={{ width: '794px', height: '1123px' }}
    >
      <div className="flex items-start justify-between border-b border-slate-300 p-5">
        <Image src="/logo.png" width={150} height={150} alt="logo" />
        <div className="max-w-[340px]">
          <h1 className="text-2xl font-bold">
            Bloksupplychain Securelog India Private Limited
          </h1>
          <p className="text-left text-xs">
            We Work 12TH Floor, Solus 1202 Hiranandani Estate, Thane West,
            Thane, Maharashtra 400607, India GSTIN 27AAJCB5935D1ZO
          </p>
        </div>
        <h1 className="pt-[120px] text-2xl font-normal">ESTIMATE</h1>
      </div>

      <div className="flex">
        <div className="w-1/2 border-b border-r border-slate-300 p-5 text-xs">
          <p>
            <span className="font-medium">#</span>: EST-{blok_quoteId}
          </p>
          <p>
            <span className="font-medium">Estimate Date</span>: {validFrom}
          </p>
          <p>
            <span className="font-medium">Expiry Date</span>: {validTo}
          </p>
        </div>
        <div className="w-1/2 border-b border-slate-300 p-5 text-xs">
          <p>
            <span className="font-medium">Place of supply</span>:{' '}
            {placeOfSupply}
          </p>
        </div>
      </div>

      <div className="flex bg-stone-100">
        <div className="w-1/2 border-b border-r border-slate-300 px-5 py-2 text-xs">
          <p className="font-medium">Bill To</p>
        </div>
        <div className="w-1/2 border-b border-slate-300 px-5 py-2 text-xs">
          <p className="font-medium">Ship To</p>
        </div>
      </div>

      <div className="flex">
        <div className="w-1/2 border-b border-r border-slate-300 px-5 py-2 text-xs">
          <p>{billTo.name}</p>
          <p>{billTo.company}</p>
          <p>{billTo.address}</p>
        </div>
        <div className="w-1/2 border-b border-slate-300 px-5 py-2 text-xs">
          <p>{shipTo}</p>
        </div>
      </div>

      <div className="border-b border-slate-300 p-5 text-xs">
        <p className="font-medium">Subject:</p>
        <p>{subject}</p>
      </div>

      <div className="min-h-full flex-1 border-b border-slate-300 px-5 py-2 text-xs">
        {children}
      </div>
    </div>
  )
}
