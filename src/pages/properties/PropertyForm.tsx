import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
    createProperty,
    getPropertyById,
    updateProperty,
    type ICreatePropertyDTO,
} from '@/services/property.service'
import {
    getFieldDefinitions,
    type IFieldDefinition,
} from '@/services/field-definition.service'

const PropertyForm = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const isEditMode = !!id

    const [loading, setLoading] = useState(false)
    const [fieldDefinitions, setFieldDefinitions] = useState<IFieldDefinition[]>([])
    const [formData, setFormData] = useState<ICreatePropertyDTO>({
        title: '',
        status: 'pending',
        location: {
            city: '',
            locality: '',
        },
        images: [], // Placeholder
        attributes: {},
    })

    // Fetch field definitions and property data (if edit)
    useEffect(() => {
        const init = async () => {
            setLoading(true)
            try {
                // 1. Fetch Field Definitions
                const fieldsRes = await getFieldDefinitions({ entityType: 'property', isActive: true, limit: 100 })
                const definitions = fieldsRes.data
                setFieldDefinitions(definitions)

                // 2. If Edit Mode, Fetch Property
                if (isEditMode) {
                    const property = await getPropertyById(id)
                    setFormData({
                        title: property.title,
                        status: property.status,
                        location: {
                            city: property.location?.city || '',
                            locality: property.location?.locality || '',
                        },
                        attributes: property.attributes || {},
                        images: property.images || [],
                    })

                    // Ensure attributes object has keys for all definitions (default to undefined or type specific empty)
                    // This part is handled by controlled inputs, just need to make sure formData.attributes exists
                } else {
                    // Initialize attributes for create mode to avoid undefined errors in controlled inputs
                    const initialAttributes: Record<string, any> = {}
                    definitions.forEach(def => {
                        // Initialize boolean to false, others can be undefined/empty string
                        if (def.dataType === 'boolean') initialAttributes[def.fieldKey] = false;
                        // Don't init others to empty string unless you want to send empty strings, 
                        // usually undefined is better for 'required' checks on backend if empty.
                        // But for controlled inputs we might need empty string to avoid warning.
                        if (def.dataType === 'string' || def.dataType === 'number') initialAttributes[def.fieldKey] = '';
                        if (def.dataType === 'select') initialAttributes[def.fieldKey] = '';
                        if (def.dataType === 'multi-select') initialAttributes[def.fieldKey] = [];

                    })
                    setFormData(prev => ({ ...prev, attributes: initialAttributes }))
                }
            } catch (error) {
                toast.error('Failed to load form data')
                navigate('/properties')
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [id, isEditMode, navigate])

    const handleStaticChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                [name]: value,
            },
        }))
    }

    const handleAttributeChange = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [key]: value,
            },
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Clean up attributes before sending
            // Ensure numbers are numbers, etc if needed. 
            // Current HTML number input returns string, so explicit conversion might be good but Zod usually handles coercion if set up, 
            // but let's be safe for dynamic fields if we can, or rely on backend.
            // Backend Zod schema should handle type checking.

            // We need to parse number inputs to actual numbers because standard HTML input type="number" returns strings
            const cleanedAttributes = { ...formData.attributes };
            fieldDefinitions.forEach(def => {
                if (def.dataType === 'number' && typeof cleanedAttributes[def.fieldKey] === 'string' && cleanedAttributes[def.fieldKey] !== '') {
                    cleanedAttributes[def.fieldKey] = Number(cleanedAttributes[def.fieldKey]);
                }
            });

            const payload = { ...formData, attributes: cleanedAttributes };

            if (isEditMode) {
                await updateProperty(id!, payload)
                toast.success('Property updated successfully')
            } else {
                await createProperty(payload)
                toast.success('Property created successfully')
            }
            navigate('/properties')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong')
            console.error(error.response?.data)
        } finally {
            setLoading(false)
        }
    }

    // Helper to render dynamic inputs
    const renderDynamicField = (field: IFieldDefinition) => {
        const value = formData.attributes?.[field.fieldKey]

        // Common props
        const baseProps = {
            name: field.fieldKey,
            id: field.fieldKey,
            disabled: loading,
        }

        const inputClasses = 'w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500'

        switch (field.dataType) {
            case 'string':
                return (
                    <input
                        {...baseProps}
                        type='text'
                        value={value || ''}
                        onChange={(e) => handleAttributeChange(field.fieldKey, e.target.value)}
                        className={inputClasses}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                )

            case 'number':
                return (
                    <input
                        {...baseProps}
                        type='number'
                        value={value !== undefined ? value : ''}
                        onChange={(e) => handleAttributeChange(field.fieldKey, e.target.value)}
                        className={inputClasses}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                )

            case 'boolean':
                return (
                    <div className='flex items-center h-full'>
                        <label className='flex items-center cursor-pointer'>
                            <input
                                {...baseProps}
                                type='checkbox'
                                checked={!!value}
                                onChange={(e) => handleAttributeChange(field.fieldKey, e.target.checked)}
                                className='w-4 h-4 text-blue-600 bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 rounded focus:ring-blue-500'
                            />
                            <span className='ml-2 text-sm text-slate-700 dark:text-neutral-300'>{field.label}</span>
                        </label>
                    </div>
                )

            case 'select':
                return (
                    <select
                        {...baseProps}
                        value={value || ''}
                        onChange={(e) => handleAttributeChange(field.fieldKey, e.target.value)}
                        className={inputClasses}
                    >
                        <option value=''>Select {field.label}</option>
                        {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                )

            case 'multi-select':
                return (
                    <select
                        {...baseProps}
                        multiple
                        value={Array.isArray(value) ? value : []}
                        onChange={(e) => {
                            const options = Array.from(e.target.selectedOptions, option => option.value);
                            handleAttributeChange(field.fieldKey, options);
                        }}
                        className={`${inputClasses} h-32`}
                    >
                        {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                );

            default:
                return null
        }
    }

    return (
        <div className='p-8 max-w-4xl mx-auto'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-slate-900 dark:text-neutral-100 mb-2 tracking-tight'>
                    {isEditMode ? 'Edit Property' : 'Create New Property'}
                </h1>
                <p className='text-slate-600 dark:text-neutral-400'>
                    Fill in the details below. Dynamic fields are loaded based on current configuration.
                </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-8'>

                {/* Section 1: Basic Info */}
                <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-none'>
                    <h2 className='text-xl font-semibold text-slate-900 dark:text-neutral-100 border-b border-slate-200 dark:border-neutral-800 pb-2'>Basic Information</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>Title <span className='text-red-500'>*</span></label>
                            <input
                                type='text'
                                name='title'
                                value={formData.title}
                                onChange={handleStaticChange}
                                required
                                className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>Status</label>
                            <select
                                name='status'
                                value={formData.status}
                                onChange={handleStaticChange}
                                className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500'
                            >
                                <option value='pending'>Pending</option>
                                <option value='active'>Active</option>
                                <option value='blocked'>Blocked</option>
                            </select>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>City <span className='text-red-500'>*</span></label>
                            <input
                                type='text'
                                name='city'
                                value={formData.location?.city || ''}
                                onChange={handleLocationChange}
                                required
                                className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>Locality <span className='text-red-500'>*</span></label>
                            <input
                                type='text'
                                name='locality'
                                value={formData.location?.locality || ''}
                                onChange={handleLocationChange}
                                required
                                className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500'
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Dynamic Attributes */}
                <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-none'>
                    <h2 className='text-xl font-semibold text-slate-900 dark:text-neutral-100 border-b border-slate-200 dark:border-neutral-800 pb-2'>Property Details</h2>

                    {fieldDefinitions.length === 0 ? (
                        <p className='text-slate-500 dark:text-neutral-500 italic'>No dynamic fields defined. Please create field definitions first.</p>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {fieldDefinitions.map((field) => (
                                <div key={field._id} className={field.dataType === 'multi-select' ? 'md:col-span-2' : ''}>
                                    <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>
                                        {field.label}
                                        {field.required && <span className='text-red-500 ml-1'>*</span>}
                                    </label>
                                    {renderDynamicField(field)}
                                    {field.rules && (
                                        <p className='text-xs text-slate-500 dark:text-neutral-500 mt-1'>
                                            {field.dataType === 'number' && field.rules.min !== undefined && `Min: ${field.rules.min} `}
                                            {field.dataType === 'number' && field.rules.max !== undefined && `Max: ${field.rules.max}`}
                                            {field.dataType === 'string' && field.rules.regex && `Format: ${field.rules.regex}`}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className='flex justify-end gap-3'>
                    <button
                        type='button'
                        onClick={() => navigate('/properties')}
                        className='px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Saving...' : isEditMode ? 'Update Property' : 'Create Property'}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default PropertyForm
