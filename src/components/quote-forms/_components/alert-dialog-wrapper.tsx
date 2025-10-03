'use client'

import * as React from 'react'
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Server,
  Search,
  RefreshCw,
  Clock,
  Wifi,
  AlertCircle,
} from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Alert types with predefined configurations
export type AlertType =
  | 'no-quotes'
  | 'server-busy'
  | 'network-error'
  | 'validation-error'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'loading-timeout'
  | 'rate-limit'
  | 'custom'

// Alert configuration interface
export interface AlertConfig {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  primaryAction?: {
    label: string
    onClick: () => void
    variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  showCancel?: boolean
  cancelLabel?: string
}

// Predefined alert configurations
const alertConfigs: Record<Exclude<AlertType, 'custom'>, AlertConfig> = {
  'no-quotes': {
    title: 'No Quotes Available',
    description:
      "We couldn't find any quotes matching your criteria. Please try adjusting your search parameters or check back later.",
    icon: Search,
    iconColor: 'text-blue-500',
    primaryAction: {
      label: 'Try Again',
      onClick: () => window.location.reload(),
    },
    showCancel: true,
    cancelLabel: 'Modify Search',
  },
  'server-busy': {
    title: 'Server Busy',
    description:
      'Our servers are currently experiencing high traffic. Please wait a moment and try again.',
    icon: Server,
    iconColor: 'text-orange-500',
    primaryAction: {
      label: 'Retry',
      onClick: () => window.location.reload(),
    },
    showCancel: true,
    cancelLabel: 'Wait',
  },
  'network-error': {
    title: 'Connection Error',
    description:
      'Unable to connect to our servers. Please check your internet connection and try again.',
    icon: Wifi,
    iconColor: 'text-red-500',
    primaryAction: {
      label: 'Retry',
      onClick: () => window.location.reload(),
    },
    showCancel: true,
    cancelLabel: 'Cancel',
  },
  'validation-error': {
    title: 'Invalid Information',
    description:
      'Please check your input and make sure all required fields are filled correctly.',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    primaryAction: {
      label: 'Review Form',
      onClick: () => {},
    },
    showCancel: false,
  },
  success: {
    title: 'Success',
    description: 'Your request has been processed successfully.',
    icon: CheckCircle,
    iconColor: 'text-green-500',
    primaryAction: {
      label: 'Continue',
      onClick: () => {},
    },
    showCancel: false,
  },
  info: {
    title: 'Information',
    description: "Here's some important information for you.",
    icon: Info,
    iconColor: 'text-blue-500',
    primaryAction: {
      label: 'Got it',
      onClick: () => {},
    },
    showCancel: false,
  },
  warning: {
    title: 'Warning',
    description: 'Please review this important information before proceeding.',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    primaryAction: {
      label: 'Proceed',
      onClick: () => {},
      variant: 'destructive',
    },
    showCancel: true,
    cancelLabel: 'Cancel',
  },
  error: {
    title: 'Error',
    description:
      'An unexpected error occurred. Please try again or contact support if the problem persists.',
    icon: XCircle,
    iconColor: 'text-red-500',
    primaryAction: {
      label: 'Try Again',
      onClick: () => window.location.reload(),
    },
  },
  'loading-timeout': {
    title: 'Request Timeout',
    description:
      'The request is taking longer than expected. This might be due to high server load.',
    icon: Clock,
    iconColor: 'text-orange-500',
    primaryAction: {
      label: 'Continue Waiting',
      onClick: () => {},
    },
    secondaryAction: {
      label: 'Retry',
      onClick: () => window.location.reload(),
    },
    showCancel: true,
    cancelLabel: 'Cancel',
  },
  'rate-limit': {
    title: 'Too Many Requests',
    description:
      "You've made too many requests in a short time. Please wait a moment before trying again.",
    icon: RefreshCw,
    iconColor: 'text-red-500',
    primaryAction: {
      label: 'Wait & Retry',
      onClick: () => {
        setTimeout(() => window.location.reload(), 5000)
      },
    },
    showCancel: true,
    cancelLabel: 'Cancel',
  },
}

export interface AlertDialogWrapperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: AlertType
  customConfig?: Partial<AlertConfig>
  className?: string
  children?: React.ReactNode
}

export const AlertDialogWrapper: React.FC<AlertDialogWrapperProps> = ({
  open,
  onOpenChange,
  type,
  customConfig,
  className,
  children,
}) => {
  // Get base configuration
  const baseConfig = type === 'custom' ? {} : alertConfigs[type]

  // Merge with custom configuration
  const config: AlertConfig = {
    title: 'Alert',
    description: 'Something happened.',
    icon: AlertCircle,
    iconColor: 'text-gray-500',
    showCancel: false,
    ...baseConfig,
    ...customConfig,
  }

  const IconComponent = config.icon

  const handlePrimaryAction = () => {
    config.primaryAction?.onClick()
    onOpenChange(false)
  }

  const handleSecondaryAction = () => {
    config.secondaryAction?.onClick()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn('sm:max-w-md', className)}>
        <AlertDialogHeader>
          <div className="mb-2 flex items-center gap-3">
            <div className={cn('flex-shrink-0', config.iconColor)}>
              <IconComponent className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-left">
              {config.title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {config.description}
          </AlertDialogDescription>
          {children && <div className="mt-4">{children}</div>}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
          {config.showCancel && (
            <AlertDialogCancel onClick={handleCancel}>
              {config.cancelLabel || 'Cancel'}
            </AlertDialogCancel>
          )}
          {config.secondaryAction && (
            <Button
              variant="outline"
              onClick={handleSecondaryAction}
              className="w-full sm:w-auto"
            >
              {config.secondaryAction.label}
            </Button>
          )}
          {config.primaryAction && (
            <AlertDialogAction
              onClick={handlePrimaryAction}
              className={cn(
                'w-full sm:w-auto',
                config.primaryAction.variant === 'destructive' &&
                  'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              )}
            >
              {config.primaryAction.label}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Convenience hook for managing alert state
export const useAlertDialog = () => {
  const [alertState, setAlertState] = React.useState<{
    open: boolean
    type: AlertType
    customConfig?: Partial<AlertConfig>
  }>({
    open: false,
    type: 'info',
  })

  const showAlert = React.useCallback(
    (type: AlertType, customConfig?: Partial<AlertConfig>) => {
      setAlertState({
        open: true,
        type,
        customConfig,
      })
    },
    []
  )

  const hideAlert = React.useCallback(() => {
    setAlertState((prev) => ({ ...prev, open: false }))
  }, [])

  return {
    ...alertState,
    showAlert,
    hideAlert,
    onOpenChange: hideAlert,
  }
}

// Export predefined alert types for easy access
export const AlertTypes = {
  NO_QUOTES: 'no-quotes' as const,
  SERVER_BUSY: 'server-busy' as const,
  NETWORK_ERROR: 'network-error' as const,
  VALIDATION_ERROR: 'validation-error' as const,
  SUCCESS: 'success' as const,
  INFO: 'info' as const,
  WARNING: 'warning' as const,
  ERROR: 'error' as const,
  LOADING_TIMEOUT: 'loading-timeout' as const,
  RATE_LIMIT: 'rate-limit' as const,
  CUSTOM: 'custom' as const,
}
