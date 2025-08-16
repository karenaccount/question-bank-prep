import React from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { DateRange } from "react-day-picker";

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
  // Convert our DateRange format to the library's format
  const convertToLibraryFormat = (range: DateRange | undefined) => {
    if (!range) return null;
    
    return {
      startDate: range.from || null,
      endDate: range.to || null,
    };
  };

  // Convert library format back to our DateRange format
  const convertFromLibraryFormat = (value: any) => {
    if (!value) {
      onChange?.(undefined);
      return;
    }

    let range: DateRange | undefined = undefined;
    
    if (value.startDate || value.endDate) {
      range = {
        from: value.startDate ? new Date(value.startDate) : undefined,
        to: value.endDate ? new Date(value.endDate) : undefined,
      };
    }
    
    onChange?.(range);
  };

  return (
    <div className={className}>
      <Datepicker
        value={convertToLibraryFormat(value)}
        onChange={convertFromLibraryFormat}
        placeholder={placeholder}
        separator="至"
        displayFormat="YYYY-MM-DD"
        readOnly={true}
        showShortcuts={true}
        configs={{
          shortcuts: {
            today: "今天",
            yesterday: "昨天",
            past: (period: number) => `最近 ${period} 天`,
            currentMonth: "本月",
            pastMonth: "上个月",
          },
        }}
        inputClassName="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
        containerClassName="relative"
        popoverDirection="down"
        primaryColor="blue"
      />
    </div>
  );
}