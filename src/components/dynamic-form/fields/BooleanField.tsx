import React from 'react'
import type { DynamicFieldProps } from '../types'

export const BooleanField: React.FC<DynamicFieldProps> = ({
    // @ts-ignore
    definition,
    value,
    onChange,
    disabled
}) => {
    const isChecked = !!value

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            onClick={() => !disabled && onChange(!isChecked)}
            disabled={disabled}
            className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
                ${isChecked ? 'bg-blue-600' : 'bg-slate-200 dark:bg-neutral-700'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                    ${isChecked ? 'translate-x-5' : 'translate-x-0'}
                `}
            />
        </button>
    )
}
