'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Package,
  FileText,
  Search,
  BookOpen,
  Globe,
  Truck,
  Warehouse,
  ChevronDown,
  // Menu,
} from 'lucide-react'
import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
// import { Button } from '@/components/ui/button'
// import {
//     Sheet,
//     SheetContent,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from '@/components/ui/sheet'

const navigationItems = [
  {
    title: 'Services',
    icon: Package,
    hasSubmenu: true,
    submenu: [
      {
        title: 'Sea Freight',
        href: '/get-rates?mode=SEA',
        icon: Globe,
      },
      {
        title: 'Air Freight',
        href: '/get-rates?mode=AIR',
        icon: Package,
      },
      {
        title: 'Land Transport',
        href: '/get-rates?mode=LAND',
        icon: Truck,
      },
      {
        title: 'Warehouse Solutions',
        href: '/get-rates?mode=WAR',
        icon: Warehouse,
      },
    ],
  },
  {
    title: 'Booking',
    href: '/confirmed-quote',
    icon: BookOpen,
  },
  {
    title: 'Tracking',
    href: '/tracking',
    icon: Search,
  },
  {
    title: 'Quotes',
    href: '/offer',
    icon: FileText,
  },
]

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const [openServices, setOpenServices] = useState(true)

  return (
    <nav className="flex-1 space-y-1 p-4">
      {navigationItems.map((item) => {
        if (item.hasSubmenu) {
          return (
            <Collapsible
              key={item.title}
              open={openServices}
              onOpenChange={setOpenServices}
            >
              <CollapsibleTrigger
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-stone-100 hover:text-stone-900',
                  'text-stone-700'
                )}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.title}</span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openServices && 'rotate-180'
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pl-4 pt-1">
                {item.submenu?.map((subItem) => {
                  const isActive =
                    pathname === subItem.href ||
                    pathname.startsWith(subItem.href)
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      onClick={onLinkClick}
                      className={cn(
                        'flex items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-stone-100 hover:text-stone-900',
                        isActive
                          ? 'bg-stone-100 font-medium text-stone-900'
                          : 'text-stone-600'
                      )}
                    >
                      <subItem.icon className="mr-3 h-4 w-4" />
                      <span>{subItem.title}</span>
                    </Link>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          )
        }

        const Icon = item.icon
        const isActive =
          pathname === item.href || pathname.startsWith(item.href!)

        return (
          <Link
            key={item.title}
            href={item.href!}
            onClick={onLinkClick}
            className={cn(
              'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-stone-100 hover:text-stone-900',
              isActive ? 'bg-stone-100 text-stone-900' : 'text-stone-700'
            )}
          >
            <Icon className="mr-3 h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default function DashboardSidebar() {
  // const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Toggle */}
      {/* <div className="md:hidden fixed top-20 left-4 z-40">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle sidebar</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SheetHeader className="border-b p-4">
                            <SheetTitle>Navigation</SheetTitle>
                        </SheetHeader>
                        <SidebarContent onLinkClick={() => setIsOpen(false)} />
                    </SheetContent>
                </Sheet> */}
      {/* </div> */}
    </>
  )
}
