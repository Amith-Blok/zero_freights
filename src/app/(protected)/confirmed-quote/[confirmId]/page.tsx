import { Phone, Mail, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getConfirmedQuoteById } from '@/data/confirmed-quotes/confirmed-quotes'
import WarehouseConfirmedQuotes from './_components/warehouse-confirmed-quotes'
import AirConfirmedQuotes from './_components/air-confirmed-quotes'
import LandConfirmedQuotes from './_components/land-confirmed-quotes'
import SeaLclConfirmedQuotes from './_components/sea-lcl-confirmed-quotes'
import SeaFclConfirmedQuotes from './_components/sea-fcl-confirmed-qoutes'
import SeaDgConfirmedQuotes from './_components/sea-dg-confirmed-quotes'
import SeaRfConfirmedQuotes from './_components/sea-rf-confirmed-quotes'
import SeaIgConfirmedQuotes from './_components/sea-ig-confirmed-quotes'
import SeaOogConfirmedQuotes from './_components/sea-oog-confirmed-quotes'

export default async function ConfirmedQuoteDetailsPage(props: {
  params: Promise<{ confirmId: string }>
}) {
  const params = await props.params
  const confirmQuote = await getConfirmedQuoteById(params.confirmId)
  if (!confirmQuote) return notFound()

  const { blok_id, mode } = confirmQuote

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      {/* Success Message */}
      <section className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Booked Successfully!
        </h1>
        <p className="text-md text-gray-600">
          Thank you for choosing our services. Our team will contact you soon
          regarding your selected offer.
        </p>
      </section>

      {/* Selected Offer Details */}
      {mode === 'CONFIRMED_WAR' ? (
        <WarehouseConfirmedQuotes {...confirmQuote} />
      ) : mode === 'CONFIRMED_AIR' ? (
        <AirConfirmedQuotes {...confirmQuote} />
      ) : mode === 'CONFIRMED_LAND' ? (
        <LandConfirmedQuotes {...confirmQuote} />
      ) : mode === 'CONFIRMED_SEA_LCL' ? (
        <SeaLclConfirmedQuotes {...confirmQuote} />
      ) : mode === 'CONFIRMED_SEA_FCL' ? (
        <SeaFclConfirmedQuotes {...confirmQuote} />
      ) : mode === 'CONFIRMED_SEA_DG' ? (
        <SeaDgConfirmedQuotes {...confirmQuote} />
      ) : mode === 'CONFIRMED_SEA_RF' ? (
        <SeaRfConfirmedQuotes {...confirmQuote} />
      ) : mode === 'CONFIRMED_SEA_IG' ? (
        <SeaIgConfirmedQuotes {...confirmQuote} />
      ) : mode === 'CONFIRMED_SEA_OOG' ? (
        <SeaOogConfirmedQuotes {...confirmQuote} />
      ) : (
        <></>
      )}

      {/* Next Steps + Contact */}
      <div className="mb-8 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-zinc-600" />
              <span>What Happens Next?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {[
                'Our logistics specialist will review your requirements within 2-4 hours',
                "You'll receive a detailed quote and shipping timeline via email",
                'Our team will coordinate pickup and delivery schedules',
                'Real-time tracking information will be provided',
              ].map((step, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-zinc-600" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NEXT_PUBLIC_CONTACT_PHONE && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-zinc-600" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <Link
                    href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE}`}
                    className="text-sm text-gray-600"
                  >
                    {process.env.NEXT_PUBLIC_CONTACT_PHONE}
                  </Link>
                </div>
              </div>
            )}
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-zinc-600" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <Link
                    href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                    className="text-sm text-gray-600"
                  >
                    {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                  </Link>
                </div>
              </div>
            )}
            <div className="pt-2 text-sm text-gray-600">
              <strong>Business Hours:</strong>
              <br />
              Monday - Friday: 9:00 AM - 6:00 PM
              <br />
              Saturday: 10:00 AM - 4:00 PM
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reference Number */}
      <div className="mt-8 rounded-lg bg-gray-100 p-4 text-center">
        <p className="text-sm text-gray-600">
          Reference Number:{' '}
          <span className="font-mono font-medium">{blok_id}</span>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Please keep this reference number for your records
        </p>
      </div>
    </div>
  )
}
