import React from 'react'
import type { DynamicFieldProps } from '../types'

export const TextField: React.FC<DynamicFieldProps> = ({
    definition,
    value,
    onChange,
    disabled
}) => {
    const isNumber = definition.dataType === 'number'

    return (
        <input
            type={isNumber ? 'number' : 'text'}
            id={definition.fieldKey}
            name={definition.fieldKey}
            value={value !== undefined && value !== null ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={`Enter ${definition.label.toLowerCase()}`}
            className="w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
    )
}
