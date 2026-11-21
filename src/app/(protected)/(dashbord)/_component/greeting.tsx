'use client'

import { useEffect, useState } from 'react'

// Get greeting based on the user's local time of day
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export default function Greeting() {
  // Start empty so server and browser render the same HTML,
  // then fill in using the browser's clock after mount
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    setGreeting(getGreeting())
    // Re-check every minute so the greeting changes while the page is open
    const interval = setInterval(() => setGreeting(getGreeting()), 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
      {greeting || ' '}
    </span>
  )
}
