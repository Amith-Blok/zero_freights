'use client'
import Image from 'next/image'

interface QuoteTemplateProps {
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

export const QuoteTemplate = ({
  children,
  placeOfSupply,
  subject,
  validFrom,
  validTo,
  billTo,
  shipTo,
  blok_quoteId,
}: QuoteTemplateProps) => {
  return (
    <div className="h-full w-full bg-card">
      <div className="flex items-start justify-between border-b border-solid border-slate-300 p-5">
        <Image src="/logo.png" width={150} height={150} alt="logo" />
        <div className="max-w-[340px]">
          <h1 className="text-2xl font-bold">
            Bloksupplychain Securelog India Private Limited
          </h1>
          <p className="text-left text-sm">
            We Work 12TH Floor, Solus 1202 Hiranandani Estate, Thane West,
            Thane, Maharashtra 400607, India GSTIN 27AAJCB5935D1ZO
          </p>
        </div>
        <h1 className="pt-[120px] text-2xl font-normal">ESTIMATE</h1>
      </div>

      <div className="flex">
        <div className="flex w-1/2 flex-col items-start justify-start border-b border-r border-solid border-slate-300 p-5 text-sm">
          <p>
            <span className="font-medium">#</span>: EST-{blok_quoteId}
          </p>
          <p>
            <span className="font-medium">Estimate Date</span>:{validFrom}
          </p>
          <p>
            <span className="font-medium">Expiry Date</span>: {validTo}
          </p>
        </div>
        <div className="w-1/2 border-b border-solid border-slate-300 p-5 text-sm">
          <p>
            <span className="font-medium">Place of supply</span>:{' '}
            {placeOfSupply}
          </p>
        </div>
      </div>

      <div className="flex bg-stone-100">
        <div className="flex w-1/2 flex-col items-start justify-start border-b border-r border-solid border-slate-300 px-5 py-2 text-sm">
          <p>Bill To</p>
        </div>
        <div className="w-1/2 border-b border-solid border-slate-300 px-5 py-2 text-sm">
          <p> Ship To</p>
        </div>
      </div>

      <div className="flex">
        <div className="flex w-1/2 flex-col items-start justify-start border-b border-r border-solid border-slate-300 px-5 py-2 text-sm">
          <p className="text-sm">{billTo.name}</p>
          <p className="text-sm">{billTo.company}</p>
          <p className="text-sm"> {billTo.address}</p>
        </div>
        <div className="w-1/2 border-b border-solid border-slate-300 px-5 py-2 text-sm">
          <p className="text-sm">{shipTo}</p>
        </div>
      </div>

      <div className="flex flex-col border-b border-solid border-slate-300 p-5 text-sm">
        <p>Subject :</p>
        <p>{subject}</p>
      </div>

      <div className="max-w-screen flex flex-col border-b border-solid border-slate-300 px-5 py-2">
        {children}
      </div>
    </div>
  )
}
