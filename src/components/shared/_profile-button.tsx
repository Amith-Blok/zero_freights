// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { LogoutButton } from '../auth/logout-button';
// import { IoMdExit } from 'react-icons/io';
// import { useSession } from 'next-auth/react';
// import { FaAngleDown } from 'react-icons/fa';
// import { LoginButton } from '../auth/login-button';
// import { useAuthDialogStore } from '@/store/auth-dialog-store';

// const ProfileButton = () => {
//   const modalContentSetter = useAuthDialogStore(
//     (state) => state.modalContentSetter
//   );
//   const { status, data } = useSession();
//   return status === 'authenticated' ? (
//     <DropdownMenu>
//       <DropdownMenuTrigger className="flex items-center">
//         <span className="text-sm font-sans  ">{data.user.name} </span>
//         <FaAngleDown />
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuLabel>My Account</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem className="cursor-pointer" disabled>
//           Profile
//         </DropdownMenuItem>
//         <DropdownMenuItem className="cursor-pointer" disabled>
//           Settings
//         </DropdownMenuItem>
//         <DropdownMenuItem className="cursor-pointer" disabled>
//           Payment History
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />

//         <LogoutButton>
//           <DropdownMenuItem>
//             <IoMdExit className="h-4 w-4 mr-2" />
//             Sign Out
//         </DropdownMenuItem>
//         </LogoutButton>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   ) : (
//     <LoginButton mode="model" asChild>
//       <div
//         className="cursor-pointer flex justify-center items-center"
//         onClick={() => {
//           modalContentSetter('login');
//         }}
//       >
//         <IoMdExit className="h-4 w-4 mr-2" />
//         <span className="text-sm font-sans ">Sign In</span>
//       </div>
//     </LoginButton>
//   );
// };

// export default ProfileButton;
