export default function TermsPage() {
  return (
    <main className="mx-auto min-h-[297mm] w-[210mm] bg-white px-[20mm] py-[20mm] text-[11pt] leading-relaxed text-gray-900 print:p-0">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-[16pt] font-semibold">
          Terms &amp; Conditions – Digital Freight Quote
        </h1>
        <p className="mt-1 text-[11pt] font-medium">
          BlokSupplyChain SecureLog India Pvt. Ltd.
        </p>
      </div>

      {/* Content */}
      <ol className="list-decimal space-y-3 pl-5">
        <li>
          <p className="font-semibold">Indicative Nature of Quote</p>
          <p>
            All digital freight quotes generated on the BlokSupplyChain platform
            are indicative and non-binding. Final rates are subject to
            confirmation at the time of booking.
          </p>
        </li>

        <li>
          <p className="font-semibold">Validity</p>
          <p>
            Quotes are valid for a limited period (typically 24–72 hours) unless
            otherwise stated. Rates may change due to carrier revisions, space
            availability, or market conditions.
          </p>
        </li>

        <li>
          <p className="font-semibold">Rate Components</p>
          <p>
            Quoted rates may include ocean/air freight, basic surcharges, and
            origin/destination charges as specified. Local charges, customs
            duties, taxes, detention, demurrage, port congestion, peak season
            surcharges, GRI, war risk, fuel surcharges, and regulatory fees are
            excluded unless expressly mentioned.
          </p>
        </li>

        <li>
          <p className="font-semibold">Carrier &amp; Routing</p>
          <p>
            Carrier selection, routing, and transit times are estimated and
            subject to change without prior notice due to operational
            constraints, weather, or regulatory issues.
          </p>
        </li>

        <li>
          <p className="font-semibold">Cargo Details Accuracy</p>
          <p>
            Quotes are based on the information provided by the customer
            (weight, dimensions, HS code, commodity, Incoterms, and cargo
            nature). Any discrepancy may result in rate revision or booking
            rejection.
          </p>
        </li>

        <li>
          <p className="font-semibold">Space &amp; Equipment Availability</p>
          <p>
            All bookings are subject to space and equipment availability at the
            time of confirmation. BlokSupplyChain is not liable for
            non-availability of space.
          </p>
        </li>

        <li>
          <p className="font-semibold">Customs &amp; Compliance</p>
          <p>
            The customer is responsible for compliance with customs laws,
            export-import regulations, DG norms, and sanctions of the origin,
            transit, and destination countries.
          </p>
        </li>

        <li>
          <p className="font-semibold">Digital &amp; AI-Assisted Pricing</p>
          <p>
            Certain quotes may be generated using historical and AI-assisted
            pricing models. These do not constitute guaranteed carrier
            contracts.
          </p>
        </li>

        <li>
          <p className="font-semibold">Payment Terms</p>
          <p>
            Rates are subject to agreed payment terms. Advance payment may be
            required prior to shipment. Delays in payment may attract interest
            or service suspension.
          </p>
        </li>

        <li>
          <p className="font-semibold">Force Majeure</p>
          <p>
            BlokSupplyChain shall not be liable for delays or cost changes
            arising from events beyond its control, including strikes, port
            congestion, pandemics, war, or government actions.
          </p>
        </li>

        <li>
          <p className="font-semibold">Liability Limitation</p>
          <p>
            BlokSupplyChain acts as a freight forwarder/agent and shall not be
            liable for indirect or consequential losses unless covered under a
            separately agreed contract.
          </p>
        </li>

        <li>
          <p className="font-semibold">Right to Amend</p>
          <p>
            BlokSupplyChain reserves the right to amend or withdraw any digital
            quote without prior notice until booking confirmation is issued.
          </p>
        </li>

        <li>
          <p className="font-semibold">Governing Law</p>
          <p>
            These terms shall be governed by the laws of India, with
            jurisdiction subject to courts in the registered office location.
          </p>
        </li>
      </ol>
    </main>
  )
}
