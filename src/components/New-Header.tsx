'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Menu,
  ChevronDown,
  Truck,
  Package,
  Globe,
  Phone,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'

const companyMenuItems = [
  {
    title: 'About Us',
    href: '/about',
    description: 'Learn about our company and mission',
  },
  {
    title: 'Our Team',
    href: '/team',
    description: 'Meet our logistics experts',
  },
  { title: 'Careers', href: '/careers', description: 'Join our growing team' },
  {
    title: 'News & Updates',
    href: '/news',
    description: 'Latest company news and industry insights',
  },
]

const servicesMenuItems = [
  {
    title: 'Sea Freight',
    href: '/services/sea',
    description: 'Ocean shipping solutions worldwide',
    icon: Globe,
  },
  {
    title: 'Air Freight',
    href: '/services/air',
    description: 'Fast air cargo services',
    icon: Package,
  },
  {
    title: 'Land Transport',
    href: '/services/land',
    description: 'Ground transportation and trucking',
    icon: Truck,
  },
  {
    title: 'Warehouse Solutions',
    href: '/services/warehouse',
    description: 'Storage and distribution services',
    icon: Package,
  },
]

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 pt-1">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo_zf.png"
              width={160}
              height={60}
              alt="Zero Freights logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-stone-600">
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {companyMenuItems.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-stone-50 hover:text-stone-600 focus:bg-stone-50 focus:text-stone-600"
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-stone-600">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[600px] md:grid-cols-2">
                    {servicesMenuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="flex select-none space-x-3 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-stone-50 hover:text-stone-600 focus:bg-stone-50 focus:text-stone-600"
                            >
                              <Icon className="mt-1 h-5 w-5 text-stone-600" />
                              <div className="space-y-1">
                                <div className="text-sm font-medium leading-none">
                                  {item.title}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      )
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-stone-50 hover:text-stone-600 focus:bg-stone-50 focus:text-stone-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  asChild
                >
                  <Link href="/documentation">Documentation</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTA Buttons */}
          <div className="hidden items-center space-x-4 lg:flex">
            <Button variant="outline" disabled>
              Track Shipment
            </Button>
            <Button disabled>Dashboard</Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/logo_zf.png"
                      height={32}
                      alt="Zero Freights logo"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-8 flex flex-col space-y-4">
                {/* Company Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-md p-2 text-left hover:bg-stone-50">
                    <span className="font-medium">Company</span>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {companyMenuItems.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        <Link href={item.href} onClick={() => setIsOpen(false)}>
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Services Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-md p-2 text-left hover:bg-stone-50">
                    <span className="font-medium">Services</span>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {servicesMenuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <DropdownMenuItem key={item.title} asChild>
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-2"
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href="/documentation"
                  className="rounded-md p-2 font-medium hover:bg-stone-50"
                  onClick={() => setIsOpen(false)}
                >
                  Documentation
                </Link>

                {/* Mobile CTA Buttons */}
                <div className="flex flex-col space-y-3 border-t pt-4">
                  <Button variant="outline" className="w-full" disabled>
                    Track Shipment
                  </Button>
                  <Button className="w-full" disabled>
                    Get Quote
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 border-t pt-6">
                  <Link
                    href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE}`}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{process.env.NEXT_PUBLIC_CONTACT_PHONE}</span>
                  </Link>
                  <Link
                    href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</span>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
