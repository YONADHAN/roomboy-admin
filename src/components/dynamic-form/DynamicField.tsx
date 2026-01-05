import React from 'react'
import type { IFieldDefinition } from '@/services/field-definition.service'
import { TextField } from './fields/TextField'
import { SelectField } from './fields/SelectField'
import { BooleanField } from './fields/BooleanField'
import { MultiSelectField } from './fields/MultiSelectField'

interface DynamicFieldWrapperProps {
    definition: IFieldDefinition
    value: any
    onChange: (value: any) => void
    disabled?: boolean
}

export const DynamicField: React.FC<DynamicFieldWrapperProps> = (props) => {
    const { definition } = props

    const renderInput = () => {
        switch (definition.dataType) {
            case 'string':
            case 'number':
                return <TextField {...props} />
            case 'select':
                return <SelectField {...props} />
            case 'multi-select':
                return <MultiSelectField {...props} />
            case 'boolean':
                return <BooleanField {...props} />
            default:
                return (
                    <div className="text-red-500 text-sm">
                        Unsupported field type: {definition.dataType}
                    </div>
                )
        }
    }

    // Common layout wrapper
    return (
        <div className={definition.dataType === 'multi-select' ? 'md:col-span-2' : ''}>
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor={definition.fieldKey}
                        className="block text-sm font-medium text-slate-700 dark:text-neutral-300"
                    >
                        {definition.label}
                        {definition.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                </div>

                {renderInput()}

                {/* Helper text for validation rules if present - purely informational */}
                {definition.rules && (
                    <p className="text-xs text-slate-500 dark:text-neutral-500">
                        {definition.dataType === 'number' && definition.rules.min !== undefined && `Min: ${definition.rules.min} `}
                        {definition.dataType === 'number' && definition.rules.max !== undefined && `Max: ${definition.rules.max}`}
                        {definition.dataType === 'string' && definition.rules.regex && `Format: ${definition.rules.regex}`}
                    </p>
                )}
            </div>
        </div>
    )
}
