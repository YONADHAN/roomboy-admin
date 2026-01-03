import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
    createFieldDefinition,
    getFieldDefinitionById,
    updateFieldDefinition,
    type ICreateFieldDefinitionDTO,
} from '@/services/field-definition.service'

const FieldDefinitionForm = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const isEditMode = !!id

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<ICreateFieldDefinitionDTO>({
        entityType: 'property',
        fieldKey: '',
        label: '',
        dataType: 'string',
        required: false,
        options: [],
        rules: {
            min: undefined,
            max: undefined,
            regex: '',
        },
    })

    // Temporary state for managing select options input
    const [optionInput, setOptionInput] = useState('')

    useEffect(() => {
        if (isEditMode) {
            const fetchField = async () => {
                try {
                    const data = await getFieldDefinitionById(id)
                    setFormData({
                        entityType: data.entityType,
                        fieldKey: data.fieldKey,
                        label: data.label,
                        dataType: data.dataType,
                        required: data.required,
                        options: data.options || [],
                        rules: data.rules,
                    })
                } catch (error) {
                    toast.error('Failed to fetch field definition')
                    navigate('/field-definitions')
                }
            }
            fetchField()
        }
    }, [id, isEditMode, navigate])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target
        if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handleRuleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            rules: {
                ...prev.rules,
                [name]: value === '' ? undefined : name === 'regex' ? value : Number(value),
            },
        }))
    }

    const addOption = () => {
        if (!optionInput.trim()) return
        if (formData.options?.includes(optionInput.trim())) {
            toast.error('Option already exists')
            return
        }
        setFormData((prev) => ({
            ...prev,
            options: [...(prev.options || []), optionInput.trim()],
        }))
        setOptionInput('')
    }

    const removeOption = (optionToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            options: prev.options?.filter((opt) => opt !== optionToRemove),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isEditMode) {
                // fieldKey and entityType cannot be updated
                const { fieldKey, entityType, ...updateData } = formData
                await updateFieldDefinition(id!, updateData)
                toast.success('Field definition updated successfully')
            } else {
                await createFieldDefinition(formData)
                toast.success('Field definition created successfully')
            }
            navigate('/field-definitions')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const showOptions = formData.dataType === 'select' || formData.dataType === 'multi-select'
    const showNumberRules = formData.dataType === 'number'
    const showStringRules = formData.dataType === 'string'

    return (
        <div className='p-6 max-w-4xl mx-auto'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-slate-900 dark:text-neutral-100 mb-2 tracking-tight'>
                    {isEditMode ? 'Edit Field Definition' : 'Create New Field'}
                </h1>
                <p className='text-slate-600 dark:text-neutral-400'>
                    Define dynamic attributes for {formData.entityType}
                </p>
            </div>

            <form onSubmit={handleSubmit} className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-8 shadow-sm dark:shadow-none space-y-6'>

                {/* Row 1: Entity Type & Heading */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>Entity Type</label>
                        <select
                            name='entityType'
                            value={formData.entityType}
                            onChange={handleChange}
                            disabled={isEditMode}
                            className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-md px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition-all'
                        >
                            <option value='property'>Property</option>
                            <option value='product'>Product</option>
                            <option value='service'>Service</option>
                        </select>
                    </div>
                </div>

                {/* Row 2: Label & Key */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>Label <span className='text-red-500'>*</span></label>
                        <input
                            type='text'
                            name='label'
                            value={formData.label}
                            onChange={handleChange}
                            placeholder='e.g. Monthly Rent'
                            required
                            className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-md px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>
                            Field Key <span className='text-red-500'>*</span>
                            <span className='text-xs text-slate-500 dark:text-neutral-500 ml-2'>
                                (lowercase, alphanumeric, underscore)
                            </span>
                        </label>
                        <input
                            type='text'
                            name='fieldKey'
                            value={formData.fieldKey}
                            onChange={handleChange}
                            placeholder='e.g. monthly_rent'
                            disabled={isEditMode}
                            required
                            pattern='^[a-z0-9_]+$'
                            className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-md px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 font-mono transition-all'
                        />
                    </div>
                </div>

                {/* Row 3: Data Type & checkboxes */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>Data Type <span className='text-red-500'>*</span></label>
                        <select
                            name='dataType'
                            value={formData.dataType}
                            onChange={handleChange}
                            className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-md px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
                        >
                            <option value='string'>Text (String)</option>
                            <option value='number'>Number</option>
                            <option value='boolean'>Boolean (Checkbox)</option>
                            <option value='select'>Select (Dropdown)</option>
                            <option value='multi-select'>Multi-Select</option>
                        </select>
                    </div>

                    <div className='flex items-center h-full pt-6'>
                        <label className='flex items-center cursor-pointer'>
                            <input
                                type='checkbox'
                                name='required'
                                checked={formData.required}
                                onChange={handleChange}
                                className='w-4 h-4 text-blue-600 bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 rounded focus:ring-blue-500 focus:ring-offset-0'
                            />
                            <span className='ml-2 text-sm text-slate-700 dark:text-neutral-300'>Is this field required?</span>
                        </label>
                    </div>
                </div>

                {/* Conditional: Options for Select/Multi-Select */}
                {showOptions && (
                    <div className='bg-slate-50 dark:bg-neutral-800/50 p-4 rounded-lg border border-slate-200 dark:border-neutral-800'>
                        <h3 className='text-sm font-medium text-slate-700 dark:text-neutral-300 mb-3'>Options</h3>
                        <div className='flex gap-2 mb-3'>
                            <input
                                type='text'
                                value={optionInput}
                                onChange={(e) => setOptionInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                                placeholder='Enter option value'
                                className='flex-1 bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm'
                            />
                            <button
                                type='button'
                                onClick={addOption}
                                className='bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-blue-600 dark:border-transparent dark:text-neutral-100 dark:hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium shadow-sm transition-colors'
                            >
                                Add
                            </button>
                        </div>

                        <div className='flex flex-wrap gap-2'>
                            {formData.options?.map((opt) => (
                                <div key={opt} className='flex items-center bg-blue-100 dark:bg-neutral-700 text-blue-800 dark:text-neutral-100 rounded px-2 py-1 text-sm border border-blue-200 dark:border-neutral-600'>
                                    <span>{opt}</span>
                                    <button
                                        type='button'
                                        onClick={() => removeOption(opt)}
                                        className='ml-2 text-blue-400 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-red-400 focus:outline-none'
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            {(!formData.options || formData.options.length === 0) && (
                                <span className='text-slate-500 dark:text-neutral-500 text-sm italic'>No options added yet</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Conditional: Min/Max for Number */}
                {showNumberRules && (
                    <div className='bg-slate-50 dark:bg-neutral-800/50 p-4 rounded-lg border border-slate-200 dark:border-neutral-800'>
                        <h3 className='text-sm font-medium text-slate-700 dark:text-neutral-300 mb-3'>Validation Rules</h3>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-xs text-slate-500 dark:text-neutral-500 mb-1'>Min Value</label>
                                <input
                                    type='number'
                                    name='min'
                                    value={formData.rules?.min ?? ''}
                                    onChange={handleRuleChange}
                                    className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-slate-500 dark:text-neutral-500 mb-1'>Max Value</label>
                                <input
                                    type='number'
                                    name='max'
                                    value={formData.rules?.max ?? ''}
                                    onChange={handleRuleChange}
                                    className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm'
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Conditional: Regex for String */}
                {showStringRules && (
                    <div className='bg-slate-50 dark:bg-neutral-800/50 p-4 rounded-lg border border-slate-200 dark:border-neutral-800'>
                        <h3 className='text-sm font-medium text-slate-700 dark:text-neutral-300 mb-3'>Validation Rules</h3>
                        <div>
                            <label className='block text-xs text-slate-500 dark:text-neutral-500 mb-1'>Regex Pattern (Optional)</label>
                            <input
                                type='text'
                                name='regex'
                                value={formData.rules?.regex ?? ''}
                                onChange={handleRuleChange}
                                placeholder='e.g. ^[A-Z]{3}-\d{3}$'
                                className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-mono'
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className='flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-neutral-800'>
                    <button
                        type='button'
                        onClick={() => navigate('/field-definitions')}
                        className='px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-none px-6 py-2 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Saving...' : isEditMode ? 'Update Definition' : 'Create Definition'}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default FieldDefinitionForm
