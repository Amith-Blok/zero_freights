import { ServiceCard } from '@/components/shared/service-card'
import { ALL_SERVICES } from '@/constants/dashbord'
import React from 'react'

export default function ServiceSection() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {ALL_SERVICES.map((s, index) => (
        <ServiceCard
          key={index}
          title={s.title}
          description={s.description}
          href={s.href}
          icon={s.icon}
          subServices={s.subServices}
        />
      ))}
    </section>
  )
}
