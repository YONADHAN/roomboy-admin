import React from 'react'
import type { DynamicFieldProps } from '../types'

export const MultiSelectField: React.FC<DynamicFieldProps> = ({
    definition,
    value,
    onChange,
    disabled
}) => {
    const selectedValues: string[] = Array.isArray(value) ? value : []

    const toggleOption = (option: string) => {
        if (disabled) return

        const newValues = selectedValues.includes(option)
            ? selectedValues.filter((v) => v !== option)
            : [...selectedValues, option]

        onChange(newValues)
    }

    if (!definition.options || definition.options.length === 0) {
        return <p className="text-sm text-slate-500 dark:text-neutral-500 italic">No options defined</p>
    }

    return (
        <div className="flex flex-wrap gap-2">
            {definition.options.map((option) => {
                const isSelected = selectedValues.includes(option)
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => toggleOption(option)}
                        disabled={disabled}
                        className={`
                            px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
                            ${isSelected
                                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                : 'bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border-slate-300 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800'
                            }
                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        {option}
                    </button>
                )
            })}
        </div>
    )
}
