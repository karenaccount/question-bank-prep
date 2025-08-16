import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "选择日期范围",
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange) return placeholder
    
    if (dateRange.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, "yyyy-MM-dd")} - ${format(dateRange.to, "yyyy-MM-dd")}`
      } else {
        return format(dateRange.from, "yyyy-MM-dd")
      }
    }
    
    return placeholder
  }

  const handleSelect = (range: DateRange | undefined) => {
    onChange?.(range)
    
    // Only close popover when both dates are selected and they are different days
    if (range?.from && range?.to && range.from !== range.to) {
      setTimeout(() => setIsOpen(false), 100)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(undefined)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(value)}
            {value?.from && (
              <span 
                className="ml-auto text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              >
                ✕
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <p className="text-sm text-muted-foreground">
              {!value?.from 
                ? "请选择开始日期" 
                : !value?.to 
                  ? "请选择结束日期" 
                  : `已选择 ${format(value.from, "MM月dd日")} 至 ${format(value.to, "MM月dd日")}`
              }
            </p>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={2}
            className="pointer-events-auto"
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}