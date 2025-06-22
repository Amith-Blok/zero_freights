'use client'
import React from 'react'
import { BarLoader } from 'react-spinners'

export default function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <BarLoader color="black" />
    </div>
  )
}
