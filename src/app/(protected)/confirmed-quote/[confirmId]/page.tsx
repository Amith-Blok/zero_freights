import { Phone, Mail, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { getConfirmedQuoteById } from '@/data/confirmed-quote'
import { notFound } from 'next/navigation'
import { formatPhoneNumber, toTitleCase } from '@/lib/utils'
import { getDeliveryTypeLabel } from '@/types/shipping'
import { ConfirmedQuoteCard } from './confirmed-quote-card'

export default async function ConfirmedQuotePage(props: {
  params: Promise<{ confirmId: string }>
}) {
  const params = await props.params
  const confirmQuote = await getConfirmedQuoteById(params.confirmId)
  if (!confirmQuote) return notFound()

  const { user, locations, carrier, container_type, tag, transit_time } =
    confirmQuote
  const origin = locations?.[0]?.name || 'N/A'
  const destination = locations?.at(-1)?.name || 'N/A'
  const transitTime = confirmQuote.transit_time
  const deliveryType = getDeliveryTypeLabel(confirmQuote.delivery_type)
  const transitTimeInfo = transitTime
    ? `Est. ${transit_time} days ${deliveryType.toLowerCase()}`
    : 'N/A'
  const totalInr = confirmQuote.confirmed_quote.reduce(
    (acc, value) => (acc += value.inr),
    0
  )

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      {/* Success Message */}
      <section className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Offer Selected Successfully!
        </h1>
        <p className="text-md text-gray-600">
          Thank you for choosing our services. Our team will contact you soon
          regarding your selected offer.
        </p>
      </section>

      {/* Selected Offer Details */}
      <ConfirmedQuoteCard
        userName={toTitleCase(user.user_name)}
        userEmail={user.user_email}
        userPhone={formatPhoneNumber(user.user_phone)}
        userCompany={toTitleCase(user.user_company)}
        transitInfo={transitTimeInfo}
        origin={origin}
        destination={destination}
        containerType={container_type}
        tag={tag.toUpperCase()}
        carrier={carrier.toUpperCase()}
        total={totalInr}
        tableData={confirmQuote.confirmed_quote}
      />

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
          <span className="font-mono font-medium">{params.confirmId}</span>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Please keep this reference number for your records
        </p>
      </div>
    </div>
  )
}
