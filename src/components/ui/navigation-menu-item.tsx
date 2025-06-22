'use client'

import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Image from 'next/image'

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Delivery Duty Paid (DDP)',
    href: 'https://www.bloksupplychain.com/',
    description:
      'The seller is responsible for all aspects of shipping, including customs clearance and delivery.',
  },
  {
    title: 'Air Freight',
    href: 'https://www.bloksupplychain.com/',
    description:
      'Quick and efficient way to move goods and has significant advantages when moving expensive or time-sensitive items.',
  },
  {
    title: 'Deliveries Duty Unpaid (DDU)',
    href: 'https://www.bloksupplychain.com/',
    description:
      'The seller is only responsible until the goods are unloaded at the port of destination. The buyer pays import customs clearance fees, duties, and taxes upon delivery.',
  },
  {
    title: 'Warhouse',
    href: 'https://www.bloksupplychain.com/',
    description:
      'Warehouse is a significant component of the basic logistic process. It involves actions in the area of supply management, or the organization of inlet and outlet',
  },
  {
    title: 'Delivery At Place (DAP)',
    href: 'https://www.bloksupplychain.com/',
    description:
      'The seller is responsible for transportation costs, but the buyer is responsible for customs clearance and import taxes.',
  },
  {
    title: 'Full Container Load(FCL)',
    href: 'https://www.bloksupplychain.com/',
    description:
      'The container is filled with goods belonging to a single entity, such as a manufacturer, exporter, or importer.',
  },
]

export function NavigationMenuDemo() {
  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-cream">
            Company
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[540px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="https://www.bloksupplychain.com/"
                  >
                    <Image
                      src="/logo.png"
                      width={45}
                      height={45}
                      alt="logo_bsc_icon"
                    />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Bloksupplychain
                    </div>
                    <p className="text-xs leading-tight text-muted-foreground">
                      Bloksupplychain has earned the distinction of being the
                      most trusted trucker on the globe. This achievement is a
                      testament to our unwavering commitment to excellence,
                      reliability, and customer satisfaction in the world of
                      logistics.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="https://www.bloksupplychain.com/"
                title="About Us"
              >
                Bloksupplychain Securelog India Private Limited. Founded by
                visionary entrepreneur, Uttam , the company began its journey
                with a single office and a handful of dedicated employees.
              </ListItem>
              <ListItem
                href="https://www.bloksupplychain.com/"
                title="Our Vision"
              >
                The vision of Bloksupplychain SecureLog India Private Limited is
                to digitally transform the logistics landscape of India,
                revolutionizing the way goods are moved and traded both
                domestically and internationally.
              </ListItem>
              <ListItem
                href="https://www.bloksupplychain.com/"
                title="Contact Us"
              >
                We&apos;re here to answer any questions you may have about our
                services.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-cream">
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="https://www.bloksupplychain.com/ "
              className={navigationMenuTriggerStyle() + ' bg-cream'}
            >
              Documentation
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
