import * as React from "react"
import { CalendarIcon, X } from "lucide-react"
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

const quickSelectOptions = [
  { label: "最近7天", days: 7 },
  { label: "最近30天", days: 30 },
  { label: "最近90天", days: 90 },
]

export function DateRangePicker({
  value,
  onChange,
  placeholder = "请选择日期范围",
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange) return placeholder
    
    if (dateRange.from) {
      if (dateRange.to) {
        if (dateRange.from.getTime() === dateRange.to.getTime()) {
          return format(dateRange.from, "yyyy-MM-dd")
        }
        return `${format(dateRange.from, "yyyy-MM-dd")} 至 ${format(dateRange.to, "yyyy-MM-dd")}`
      } else {
        return `${format(dateRange.from, "yyyy-MM-dd")} 至 ...`
      }
    }
    
    return placeholder
  }

  const handleSelect = (range: DateRange | undefined) => {
    onChange?.(range)
    
    // Auto close when both dates are selected and different
    if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
      setTimeout(() => setIsOpen(false), 150)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(undefined)
  }

  const handleQuickSelect = (days: number) => {
    const today = new Date()
    const startDate = new Date()
    startDate.setDate(today.getDate() - days + 1)
    
    const range = { from: startDate, to: today }
    onChange?.(range)
    setIsOpen(false)
  }

  const hasValue = value?.from || value?.to

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal relative pr-10",
              !hasValue && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{formatDateRange(value)}</span>
            {hasValue && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 h-6 w-6 p-0 hover:bg-muted"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Quick Select Sidebar */}
            <div className="border-r bg-muted/30 p-3 space-y-1">
              <div className="text-xs font-medium text-muted-foreground mb-2">快捷选择</div>
              {quickSelectOptions.map((option) => (
                <Button
                  key={option.days}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8"
                  onClick={() => handleQuickSelect(option.days)}
                >
                  {option.label}
                </Button>
              ))}
              {hasValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8 text-muted-foreground"
                  onClick={() => onChange?.(undefined)}
                >
                  清除选择
                </Button>
              )}
            </div>
            
            {/* Calendar */}
            <div>
              <div className="p-3 border-b bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  {!value?.from 
                    ? "请选择开始日期" 
                    : !value?.to 
                      ? "请选择结束日期" 
                      : `${format(value.from, "MM月dd日")} 至 ${format(value.to, "MM月dd日")}`
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
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}