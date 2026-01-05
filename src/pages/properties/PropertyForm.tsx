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
import ImageUpload from '@/components/common/ImageUpload'
import { LocationPicker } from '@/components/properties/LocationPicker'
import MapPicker from '@/components/properties/MapPicker'
import { DynamicField } from '@/components/dynamic-form/DynamicField'

const PropertyForm = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const isEditMode = !!id

    const [loading, setLoading] = useState(false)
    const [uploadCount, setUploadCount] = useState(0)
    const [fieldDefinitions, setFieldDefinitions] = useState<IFieldDefinition[]>([])

    // New Form Data Structure
    const [formData, setFormData] = useState<ICreatePropertyDTO>({
        title: '',
        status: 'pending',
        location: '', // ObjectId
        address: {
            street: '',
            city: '',
            locality: '',
        },
        coordinates: {
            lat: 12.9716, // Default Bangalore
            lng: 77.5946
        },
        images: [],
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
                        location: (property.location as any)?._id || property.location || '', // Handle population or ID
                        address: {
                            street: property.address?.street || '',
                            city: property.address?.city || '',
                            locality: property.address?.locality || '',
                        },
                        coordinates: property.coordinates || { lat: 12.9716, lng: 77.5946 },
                        attributes: property.attributes || {},
                        images: property.images || [],
                    })
                } else {
                    // Initialize attributes for create mode
                    const initialAttributes: Record<string, any> = {}
                    definitions.forEach(def => {
                        if (def.dataType === 'boolean') initialAttributes[def.fieldKey] = false;
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

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
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

    const handleUploadStart = () => setUploadCount((c) => c + 1)

    const handleUploadSuccess = (url: string) => {
        setUploadCount((c) => Math.max(0, c - 1))
        setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), url],
        }))
    }

    const handleUploadError = (error: Error) => {
        console.error('Upload failed in form:', error)
        setUploadCount((c) => Math.max(0, c - 1))
    }

    const handleRemoveImage = (urlToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            images: (prev.images || []).filter((url) => url !== urlToRemove),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.location) {
            toast.error('Please select a valid location')
            return
        }

        setLoading(true)

        try {
            // Clean up attributes before sending
            const cleanedAttributes = { ...formData.attributes };
            fieldDefinitions.forEach(def => {
                if (def.dataType === 'number' && typeof cleanedAttributes[def.fieldKey] === 'string' && cleanedAttributes[def.fieldKey] !== '') {
                    cleanedAttributes[def.fieldKey] = Number(cleanedAttributes[def.fieldKey]);
                }
            });

            const payload = { ...formData, attributes: cleanedAttributes };

            if (isEditMode) {
                // @ts-ignore
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



    return (
        <div className='p-8 max-w-4xl mx-auto'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-slate-900 dark:text-neutral-100 mb-2 tracking-tight'>
                    {isEditMode ? 'Edit Property' : 'Create New Property'}
                </h1>
                <p className='text-slate-600 dark:text-neutral-400'>
                    Fill in the details below. Location data is now managed via selection and map.
                </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-8'>

                {/* Section 1: Basic Info & Location */}
                <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-none'>
                    <h2 className='text-xl font-semibold text-slate-900 dark:text-neutral-100 border-b border-slate-200 dark:border-neutral-800 pb-2'>Location & Basic Info</h2>

                    {/* Title & Status */}
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

                    {/* Location Picker */}
                    <div>
                        <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>Area / Location <span className='text-red-500'>*</span></label>
                        <LocationPicker
                            value={formData.location}
                            onChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
                        />
                        <p className='text-xs text-slate-500 mt-1'>Select the broad area (Location entity).</p>
                    </div>

                    {/* Address Details */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>Locality / Street <span className='text-red-500'>*</span></label>
                            <input
                                type='text'
                                name='locality'
                                value={formData.address.locality || ''}
                                onChange={handleAddressChange}
                                required
                                placeholder="e.g. 4th Block, Koramangala"
                                className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>City (Display) <span className='text-red-500'>*</span></label>
                            <input
                                type='text'
                                name='city'
                                value={formData.address.city || ''}
                                onChange={handleAddressChange}
                                required
                                placeholder="e.g. Bangalore"
                                className='w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded px-3 py-2 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500'
                            />
                        </div>
                    </div>

                    {/* Map Picker */}
                    <div>
                        <label className='block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1'>Pin Exact Location <span className='text-red-500'>*</span></label>
                        <MapPicker
                            value={formData.coordinates}
                            onChange={(coords) => setFormData(prev => ({ ...prev, coordinates: coords }))}
                        />
                        <p className='text-xs text-slate-500 mt-1'>Click on the map to place the pin. Use zoom to be precise.</p>
                    </div>
                </div>

                {/* Section 1.5: Images */}
                <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-none'>
                    <h2 className='text-xl font-semibold text-slate-900 dark:text-neutral-100 border-b border-slate-200 dark:border-neutral-800 pb-2'>
                        Property Images
                    </h2>
                    <ImageUpload
                        images={formData.images || []}
                        onUploadStart={handleUploadStart}
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                        onRemove={handleRemoveImage}
                    />
                </div>

                {/* Section 2: Dynamic Attributes */}
                <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-none'>
                    <h2 className='text-xl font-semibold text-slate-900 dark:text-neutral-100 border-b border-slate-200 dark:border-neutral-800 pb-2'>Property Details</h2>

                    {fieldDefinitions.length === 0 ? (
                        <p className='text-slate-500 dark:text-neutral-500 italic'>No dynamic fields defined. Please create field definitions first.</p>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {fieldDefinitions.map((field) => (
                                <DynamicField
                                    key={field._id}
                                    definition={field}
                                    value={formData.attributes?.[field.fieldKey]}
                                    onChange={(val) => handleAttributeChange(field.fieldKey, val)}
                                    disabled={loading}
                                />
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
                        disabled={loading || uploadCount > 0}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading
                            ? 'Saving...'
                            : uploadCount > 0
                                ? `Uploading (${uploadCount})...`
                                : isEditMode
                                    ? 'Update Property'
                                    : 'Create Property'}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default PropertyForm
