import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
    getFieldDefinitions,
    toggleFieldDefinitionStatus,
    deleteFieldDefinition,
    type IFieldDefinition,
} from '@/services/field-definition.service'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Power, Trash2 } from 'lucide-react'
import ConfirmationModal from '@/components/common/ConfirmationModal'

const FieldDefinitionList = () => {
    const [fields, setFields] = useState<IFieldDefinition[]>([])
    const [loading, setLoading] = useState(true)
    const [entityType, setEntityType] = useState('property')

    // Delete State
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchFields = async () => {
        setLoading(true)
        try {
            const res = await getFieldDefinitions({ entityType, limit: 100 })
            setFields(res.data)
        } catch (error) {
            toast.error('Failed to fetch field definitions')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFields()
    }, [entityType])

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleFieldDefinitionStatus(id)
            toast.success('Status updated')
            fetchFields()
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const openDeleteModal = (id: string) => {
        setItemToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setItemToDelete(null)
        setIsDeleteModalOpen(false)
    }

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return

        setIsDeleting(true)
        try {
            await deleteFieldDefinition(itemToDelete)
            toast.success('Field definition deleted associated')
            fetchFields()
            closeDeleteModal()
        } catch (error) {
            toast.error('Failed to delete field definition')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className='p-6 space-y-6'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <h1 className='text-3xl font-bold text-slate-900 dark:text-neutral-100 tracking-tight'>Field Definitions</h1>
                    <p className='text-slate-600 dark:text-neutral-400 mt-1'>Manage dynamic field configurations for entities.</p>
                </div>
                <Link to='/field-definitions/new'>
                    <Button className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-none'>
                        <Plus className='mr-2 h-4 w-4' /> Create New Field
                    </Button>
                </Link>
            </div>

            <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-4 mb-6 shadow-sm'>
                <label className='text-sm text-slate-700 dark:text-neutral-400 mb-2 block'>Filter by Entity Type</label>
                <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    className='bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 rounded px-3 py-2 w-48 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
                >
                    <option value='property'>Property</option>
                    <option value='product'>Product</option>
                    <option value='service'>Service</option>
                </select>
            </div>

            <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none'>
                {loading ? (
                    <div className='p-8 text-center text-slate-500 dark:text-neutral-500'>Loading fields...</div>
                ) : fields.length === 0 ? (
                    <div className='p-8 text-center text-slate-500 dark:text-neutral-500'>No field definitions found.</div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className='w-full text-left'>
                                <thead className='bg-gradient-to-r from-slate-50 to-slate-100 dark:bg-neutral-800 dark:from-transparent dark:to-transparent border-b border-slate-200 dark:border-neutral-800'>
                                    <tr>
                                        <th className='px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300'>Label</th>
                                        <th className='px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300'>Field Key</th>
                                        <th className='px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300'>Type</th>
                                        <th className='px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300'>Required</th>
                                        <th className='px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300'>Status</th>
                                        <th className='px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300 text-right'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-slate-100 dark:divide-neutral-800'>
                                    {fields.map((field) => (
                                        <tr key={field._id} className='hover:bg-blue-50/50 dark:hover:bg-neutral-800/60 transition-colors'>
                                            <td className='px-6 py-4 font-medium text-slate-900 dark:text-neutral-100'>{field.label}</td>
                                            <td className='px-6 py-4 text-slate-600 dark:text-neutral-300 font-mono text-sm'>
                                                {field.fieldKey}
                                            </td>
                                            <td className='px-6 py-4 text-slate-600 dark:text-neutral-300'>
                                                <span className='px-2 py-1 bg-slate-100 dark:bg-neutral-800 rounded text-xs border border-slate-200 dark:border-neutral-700 font-medium uppercase tracking-wider text-slate-700 dark:text-neutral-400'>
                                                    {field.dataType}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 text-slate-600 dark:text-neutral-300'>
                                                {field.required ? (
                                                    <span className='text-emerald-600 dark:text-green-400 text-xs font-semibold'>Yes</span>
                                                ) : (
                                                    <span className='text-slate-400 text-xs'>No</span>
                                                )}
                                            </td>
                                            <td className='px-6 py-4'>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${field.isActive
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                        : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                                        }`}
                                                >
                                                    {field.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 text-right'>
                                                <div className='flex items-center justify-end gap-2'>
                                                    <Link to={`/field-definitions/${field._id}/edit`}>
                                                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400">
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleStatus(field._id)}
                                                        className={`hover:bg-opacity-10 dark:text-neutral-400 ${field.isActive ? 'text-slate-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-neutral-800 dark:hover:text-orange-400' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-neutral-800 dark:hover:text-emerald-400'}`}
                                                    >
                                                        <Power className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openDeleteModal(field._id)}
                                                        className="text-slate-500 hover:text-red-600 hover:bg-red-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-red-400"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="grid grid-cols-1 gap-4 lg:hidden p-4">
                            {fields.map((field) => (
                                <div key={field._id} className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-slate-900 dark:text-neutral-100">{field.label}</h3>
                                            <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-1">
                                                {field.fieldKey}
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${field.isActive
                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                                }`}
                                        >
                                            {field.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm">
                                        <span className='px-2 py-1 bg-slate-100 dark:bg-neutral-800 rounded text-xs border border-slate-200 dark:border-neutral-700 font-medium uppercase tracking-wider text-slate-700 dark:text-neutral-400'>
                                            {field.dataType}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-500 dark:text-neutral-400">Required:</span>
                                            {field.required ? (
                                                <span className='text-emerald-600 dark:text-green-400 font-semibold'>Yes</span>
                                            ) : (
                                                <span className='text-slate-400'>No</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-neutral-800">
                                        <Link to={`/field-definitions/${field._id}/edit`}>
                                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleStatus(field._id)}
                                            className={`hover:bg-opacity-10 dark:text-neutral-400 ${field.isActive ? 'text-slate-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-neutral-800 dark:hover:text-orange-400' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-neutral-800 dark:hover:text-emerald-400'}`}
                                        >
                                            <Power className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openDeleteModal(field._id)}
                                            className="text-slate-500 hover:text-red-600 hover:bg-red-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-red-400"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Field Definition"
                message="Are you sure you want to delete this field definition? This action cannot be undone."
                confirmText="Delete"
                isLoading={isDeleting}
            />
        </div>
    )
}

export default FieldDefinitionList
