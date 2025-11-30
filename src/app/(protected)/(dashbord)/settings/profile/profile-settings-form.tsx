'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { ProfileSettingsSchema, ProfileSettingsType } from '@/schema/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PhoneInputWrapper from '@/components/shared/phone-input-wrapper'
import { useTransition } from 'react'
import { updateUserProfileAction } from '@/actions/user-action'
import { toast } from '@/hooks/use-toast'
import { Loader2Icon } from 'lucide-react'

interface ProfileSettingsFormProps {
  defaultValues: {
    id: string
    name: string
    email: string
    companyName?: string
    phone?: string
  }
}
export default function ProfileSettingsForm(props: ProfileSettingsFormProps) {
  const [loading, startTransition] = useTransition()
  const profileSettingForm = useForm<ProfileSettingsType>({
    resolver: zodResolver(ProfileSettingsSchema),
    defaultValues: props.defaultValues,
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = profileSettingForm

  const onHandleSubmit = (data: ProfileSettingsType) => {
    // Trim leading and trailing spaces
    const trimmedData = {
      id: props.defaultValues.id,
      name: props.defaultValues.name,
      companyName: data.companyName?.trim(),
      phone: data.phone?.trim(),
    }

    startTransition(async () => {
      const response = await updateUserProfileAction(trimmedData)
      if (response.error) {
        toast({
          title: 'Error',
          description: response.error as string,
        })
      }
    })
    console.log(trimmedData)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }
  return (
    <FormProvider {...profileSettingForm}>
      <form
        onSubmit={handleSubmit(onHandleSubmit)}
        onKeyDown={handleKeyDown}
        className="max-w-2xl space-y-6"
      >
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name
          </Label>
          <Input
            id="name"
            className="w-full cursor-pointer text-gray-500 caret-transparent focus:border-none focus:shadow-none focus:outline-none focus:ring-0"
            readOnly
            value={props.defaultValues.name}
          />
        </div>
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="name"
            className="w-full cursor-pointer text-gray-500 caret-transparent focus:border-none focus:shadow-none focus:outline-none focus:ring-0"
            readOnly
            value={props.defaultValues.email}
          />
        </div>

        {/* Company Name Field */}
        <div className="space-y-2">
          <Label
            htmlFor="companyName"
            className="text-sm font-medium text-gray-700"
          >
            Company Name
          </Label>
          <Input
            id="companyName"
            placeholder="Enter your company name"
            className="w-full"
            {...register('companyName')}
            disabled={loading}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.companyName.message}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <PhoneInputWrapper
            fieldName="phone"
            label="Phone"
            defaultCountry="IN"
            divClass="space-y-2"
            labelClass="text-sm font-medium text-gray-700"
            labelProps={{ className: 'text-sm font-medium text-gray-700' }}
            divProps={{ className: 'space-y-2' }}
            placeHolder="Enter your phone number"
            {...register('phone')}
            disabled={loading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full min-w-[120px] sm:w-auto">
            Save Changes
            {loading && <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
