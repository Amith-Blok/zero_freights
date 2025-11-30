import { CardWrapper } from '@/components/shared/card-wrapper'
import ProfileSettingsForm from './profile-settings-form'
import { getUser } from '@/lib/user'
import { redirect } from 'next/navigation'
import { LOGIN_ROUTE } from '@/routes'
export default async function ProfileSettingsPage() {
  const user = await getUser()
  if (!user) {
    redirect(LOGIN_ROUTE)
  }
  return (
    <CardWrapper
      cardTitle="Profile Settings"
      cardDescription="Update your profile settings"
      titleClass="text-2xl"
      cardClass="my-5  md:m-5 w-full min-h-screen bg-white bg-opacity-95"
    >
      <ProfileSettingsForm
        defaultValues={{
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          companyName: user.companyName || '',
          phone: user.phone || '',
        }}
      />
    </CardWrapper>
  )
}
