'use client'
import Link from 'next/link'
import Image from 'next/image'
import Container from './ui/container'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
// import ProfileButton from './ui/ProfileButton';
import { NavigationMenuDemo } from './ui/navigation-menu-item'
import { HEADER_ROUTES } from '@/constants'

const Header = () => {
  return (
    <header className="border-b px-4 py-3 sm:flex sm:justify-between">
      <Container>
        <div className="relative flex h-14 w-full items-center justify-between px-5 sm:px-7 md:px-9 lg:px-12 xl:px-16">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 w-10 md:hidden" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  {HEADER_ROUTES.map((route) => (
                    <div key={route.id}>
                      <Link
                        href={route.href}
                        className="block px-2 py-1 text-lg"
                      >
                        {route.label}
                      </Link>
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="lg:ml-0">
              <Image
                src="/logo_zf.png"
                width={300}
                height={52}
                alt="Zero Freights logo"
              />
            </Link>
          </div>
          <NavigationMenuDemo />

          {/* <div className=" flex  md:items-center">
            <ProfileButton />
          </div> */}
        </div>
      </Container>
    </header>
  )
}

export default Header
