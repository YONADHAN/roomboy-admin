import { useState, useEffect } from 'react'
import { getLocations } from '@/services/location.service'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

interface LocationPickerProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export const LocationPicker = ({ value, onChange, disabled }: LocationPickerProps) => {
    const [open, setOpen] = useState(false)
    const [locations, setLocations] = useState<{ label: string; value: string }[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchLocations = async () => {
            setLoading(true)
            try {
                // Fetch all active locations
                const res = await getLocations({ isActive: true, limit: 100, page: 1 })
                const formatted = res.data.map((loc: any) => ({
                    label: `${loc.name}, ${loc.city}`,
                    value: loc._id,
                }))
                setLocations(formatted)
            } catch (error) {
                console.error('Failed to fetch locations', error)
            } finally {
                setLoading(false)
            }
        }
        fetchLocations()
    }, [])

    const selectedLabel = locations.find((l) => l.value === value)?.label

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800"
                    disabled={disabled || loading}
                >
                    {value ? selectedLabel : "Select location..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search location..." />
                    <CommandList>
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup>
                            {locations.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.label}
                                    onSelect={(currentValue) => {
                                        // We need to find the ID based on label or passed value
                                        const match = locations.find(l => l.label.toLowerCase() === currentValue.toLowerCase() || l.label === currentValue)
                                        if (match) {
                                            onChange(match.value)
                                            setOpen(false)
                                        }
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === framework.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {framework.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
