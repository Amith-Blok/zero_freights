import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutButton } from '../auth/logout-button'
import { IoMdExit } from 'react-icons/io'
import { useSession } from 'next-auth/react'
import { FaAngleDown } from 'react-icons/fa'
import { LoginButton } from '../auth/login-button'

const ProfileButton = () => {
  const { status, data } = useSession()
  return status === 'authenticated' ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <span className="font-sans text-sm">{data.user.name} </span>
        <FaAngleDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" disabled>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" disabled>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" disabled>
          Payment History
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <LogoutButton>
          <DropdownMenuItem>
            <IoMdExit className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <LoginButton
      className="border-green-200"
      props={{ size: 'sm', variant: 'outline' }}
    >
      <div className="flex cursor-pointer items-center justify-center">
        <IoMdExit className="mr-2 h-4 w-4" />
        <span className="font-sans text-sm">Sign In</span>
      </div>
    </LoginButton>
  )
}

export default ProfileButton
