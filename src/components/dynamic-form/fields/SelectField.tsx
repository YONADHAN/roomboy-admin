import React from 'react'
import type { DynamicFieldProps } from '../types'

export const SelectField: React.FC<DynamicFieldProps> = ({
    definition,
    value,
    onChange,
    disabled
}) => {
    return (
        <select
            id={definition.fieldKey}
            name={definition.fieldKey}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <option value="">Select {definition.label}</option>
            {definition.options?.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    )
}
