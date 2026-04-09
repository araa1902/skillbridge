"use client"

import * as React from "react"
import { format, startOfDay, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isBefore, isEqual } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  minDate?: Date
  placeholder?: string
}

export function DatePicker({ value, onChange, minDate, placeholder = "Pick a date" }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState(value ? new Date(value) : new Date())
  const minDay = minDate ? startOfDay(minDate) : undefined

  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get first day of week offset
  const firstDayOfWeek = monthStart.getDay()
  const emptyDays = Array(firstDayOfWeek).fill(null)

  const isDateDisabled = (date: Date) => minDay ? startOfDay(date) < minDay : false
  const isDateSelected = (date: Date) => value ? isEqual(startOfDay(date), startOfDay(value)) : false

  const handleSelectDate = (date: Date) => {
    if (!isDateDisabled(date)) {
      onChange?.(date)
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full justify-start text-left font-normal h-11",
          !value && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, "PPP") : <span>{placeholder}</span>}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 p-4 w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setMonth(addMonths(month, -1))}
                className="p-1 hover:bg-muted rounded"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="font-semibold text-center">
                {format(month, "MMMM yyyy")}
              </div>
              <button
                onClick={() => setMonth(addMonths(month, 1))}
                className="p-1 hover:bg-muted rounded"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-xs font-semibold text-muted-foreground text-center">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((date) => {
                const disabled = isDateDisabled(date)
                const selected = isDateSelected(date)

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleSelectDate(date)}
                    disabled={disabled}
                    className={cn(
                      "h-8 rounded-md text-sm font-medium transition-colors",
                      selected && "bg-primary text-primary-foreground",
                      !selected && !disabled && "hover:bg-muted",
                      disabled && "opacity-50 cursor-not-allowed text-muted-foreground"
                    )}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}