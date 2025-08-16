import React, { useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SimpleDateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function SimpleDateRangePicker({
  value,
  onChange,
  placeholder = "请选择日期范围",
  className = "",
}: SimpleDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) return placeholder;
    
    if (dateRange.to) {
      if (dateRange.from.getTime() === dateRange.to.getTime()) {
        return format(dateRange.from, "yyyy-MM-dd", { locale: zhCN });
      }
      return `${format(dateRange.from, "yyyy-MM-dd", { locale: zhCN })} 至 ${format(dateRange.to, "yyyy-MM-dd", { locale: zhCN })}`;
    }
    
    return format(dateRange.from, "yyyy-MM-dd", { locale: zhCN });
  };

  const handleSelect = (range: DateRange | undefined) => {
    onChange?.(range);
    
    // Close when both dates are selected
    if (range?.from && range?.to) {
      setTimeout(() => setIsOpen(false), 100);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
  };

  const getQuickRange = (days: number): DateRange => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days + 1);
    return { from: startDate, to: today };
  };

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal relative",
              !value?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{formatDateRange(value)}</span>
            {value?.from && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-4 w-4 p-0 hover:bg-transparent"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Quick Select */}
            <div className="border-r p-3 space-y-1 min-w-[100px]">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                快捷选择
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs h-7"
                onClick={() => {
                  onChange?.(getQuickRange(7));
                  setIsOpen(false);
                }}
              >
                最近7天
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs h-7"
                onClick={() => {
                  onChange?.(getQuickRange(30));
                  setIsOpen(false);
                }}
              >
                最近30天
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs h-7"
                onClick={() => {
                  onChange?.(getQuickRange(90));
                  setIsOpen(false);
                }}
              >
                最近90天
              </Button>
              {value?.from && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-7 text-muted-foreground"
                  onClick={() => {
                    onChange?.(undefined);
                    setIsOpen(false);
                  }}
                >
                  清除
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
                      : `${format(value.from, "MM月dd日", { locale: zhCN })} 至 ${format(value.to, "MM月dd日", { locale: zhCN })}`
                  }
                </p>
              </div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={value?.from}
                selected={value}
                onSelect={handleSelect}
                numberOfMonths={1}
                className="pointer-events-auto"
                disabled={(date) => date > new Date()}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}