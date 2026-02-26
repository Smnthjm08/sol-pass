"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ChevronDownIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface DatePickerTimeProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    time: string;
    setTime: (time: string) => void;
    className?: string;
}

export function DatePickerTime({ date, setDate, time, setTime, className }: DatePickerTimeProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <FieldGroup className={cn("flex flex-row gap-3 w-full", className)}>
            <Field className="flex-1">
                <FieldLabel htmlFor="date-picker" className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Event Date</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date-picker"
                            className={cn(
                                "w-full justify-between font-medium h-11 bg-background/50 border-secondary hover:border-primary transition-all rounded-xl px-3",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                                {date ? format(date, "PPP") : "Pick a date"}
                            </span>
                            <ChevronDownIcon className="w-4 h-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl border-secondary shadow-2xl" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            defaultMonth={date}
                            onSelect={(d) => {
                                setDate(d)
                                setOpen(false)
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </Field>
            <Field className="w-[120px]">
                <FieldLabel htmlFor="time-picker" className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Time</FieldLabel>
                <div className="relative">
                    <Input
                        type="time"
                        id="time-picker"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-background/50 border-secondary focus:border-primary transition-all rounded-xl h-11 pl-9 pr-3 font-medium appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
                </div>
            </Field>
        </FieldGroup>
    )
}
