'use client'
import Link from 'next/link'
import { Phone, MapPin, Mail, Globe } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="mt-2 border-t border-gray-200 bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-1">
              <div className="flex items-center justify-center">
                {/* <span className="text-white font-bold text-sm">ZF</span> */}
                <Image
                  src="/zero.png"
                  width={90}
                  height={90}
                  alt="Zero Freights logo"
                />
              </div>
              <div>
                <h3 className="font-sans text-lg font-bold text-gray-900">
                  FREIGHTS
                </h3>
                <p className="text-xs text-gray-500">
                  Powered By Bloksupplychain SecureLog India Private Limited
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              Your trusted partner for seamless logistics solutions across air,
              sea, and land transportation.
            </p>
            <Link
              href="https://www.bloksupplychain.com"
              target="_blank"
              className="inline-flex items-center space-x-1 text-sm text-green-600 transition-colors hover:text-green-700"
            >
              <Globe className="h-4 w-4" />
              <span>www.bloksupplychain.com</span>
            </Link>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Our Services
            </h4>
            <div className="space-y-3">
              <Link
                href="/?mode=SEA"
                className="group flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-green-600"
              >
                <span className="h-1 w-1 rounded-full bg-green-600 transition-all group-hover:w-2"></span>
                <span>Sea Freight (FCL & LCL)</span>
              </Link>
              <Link
                href="/?mode=AIR"
                className="group flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-green-600"
              >
                <span className="h-1 w-1 rounded-full bg-green-600 transition-all group-hover:w-2"></span>
                <span>Air Freight</span>
              </Link>
              <Link
                href="/?mode=LAND"
                className="group flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-green-600"
              >
                <span className="h-1 w-1 rounded-full bg-green-600 transition-all group-hover:w-2"></span>
                <span>Land Transportation</span>
              </Link>
              <Link
                href="/?mode=WAR"
                className="group flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-green-600"
              >
                <span className="h-1 w-1 rounded-full bg-green-600 transition-all group-hover:w-2"></span>
                <span>Warehouse Solutions</span>
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">+91 22 4750 7283</p>
                  <p className="text-gray-500">Landline</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">+91 93216 96216</p>
                  <p className="text-gray-500">Mobile</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    12th Floor, Solus 1202
                  </p>
                  <p className="text-gray-500">
                    Hiranandani Estate, Thane West, Thane
                  </p>
                  <p className="text-gray-500">Maharashtra 400607</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                  <Mail className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-sm">
                  <Link
                    href="mailto:Sales@bloksupplychain.com"
                    className="font-medium text-gray-900 transition-colors hover:text-green-600"
                  >
                    Sales@bloksupplychain.com
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
            <div className="space-y-3">
              <Link
                href="https://www.bloksupplychain.com"
                className="block text-sm text-gray-600 transition-colors hover:text-green-600"
              >
                Company
              </Link>
              <Link
                href="https://www.bloksupplychain.com"
                className="block text-sm text-gray-600 transition-colors hover:text-green-600"
              >
                Services
              </Link>
              <Link
                href="https://www.bloksupplychain.com"
                className="block text-sm text-gray-600 transition-colors hover:text-green-600"
              >
                Documentation
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-sm text-gray-500">
              <p>
                &copy; {new Date().getFullYear()} Bloksupplychain Inc. All
                rights reserved.
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="https://bloksupplychain.com/privacy-policy"
                className="text-gray-500 transition-colors hover:text-green-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="https://bloksupplychain.com/terms-conditions"
                className="text-gray-500 transition-colors hover:text-green-600"
              >
                Terms of Service
              </Link>
              <Link
                href="https://bloksupplychain.com/contact"
                className="text-gray-500 transition-colors hover:text-green-600"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
