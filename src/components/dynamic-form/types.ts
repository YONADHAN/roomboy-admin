import type { IFieldDefinition } from '@/services/field-definition.service'

export interface DynamicFieldProps {
    definition: IFieldDefinition
    value: any
    onChange: (value: any) => void
    disabled?: boolean
    error?: string
}
