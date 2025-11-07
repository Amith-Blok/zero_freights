import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function ListDataTableComp({
  options,
  maxVisible = 3,
}: {
  options: string[]
  maxVisible?: number
}) {
  const visibleOptions = options.slice(0, maxVisible)
  const remainingCount = options.length - maxVisible
  if (options.length <= maxVisible) {
    return (
      <div className="flex flex-wrap gap-1">
        {options.map((option, index) => (
          <Badge key={index} variant="secondary" className="font-medium">
            {option}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visibleOptions.map((option, index) => (
        <Badge key={index} variant="secondary" className="font-medium">
          {option}
        </Badge>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Badge
            variant="outline"
            className="cursor-pointer text-xs hover:bg-muted"
          >
            +{remainingCount} more
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">All Attribute Values</h4>
            <div className="flex max-h-32 flex-wrap gap-1 overflow-y-auto">
              {options.map((option, index) => (
                <Badge key={index} variant="secondary" className="font-medium">
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
