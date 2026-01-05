import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { getProperties, updatePropertyStatus, deleteProperty } from '@/services/property.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Power, Trash2, Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import ConfirmationModal from '@/components/common/ConfirmationModal'

const PropertyList = () => {
    const queryClient = useQueryClient()
    const [statusFilter, setStatusFilter] = useState('')
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 300)

    // Using useQuery with keepPreviousData to prevent UI blanking during refetch
    const { data, isLoading } = useQuery({
        queryKey: ['admin-properties', statusFilter, debouncedSearch],
        queryFn: () => getProperties({ limit: 100, status: statusFilter || undefined, search: debouncedSearch }),
        placeholderData: keepPreviousData,
    })

    const properties = data?.data || []

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
            await updatePropertyStatus(id, newStatus)
            toast.success(`Property ${newStatus === 'active' ? 'activated' : 'blocked'} successfully`)
            queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    // Delete State
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = (id: string) => {
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
            await deleteProperty(itemToDelete)
            toast.success('Property deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
            closeDeleteModal()
        } catch (error) {
            toast.error('Failed to delete property')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className='p-6 space-y-6'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <h1 className='text-3xl font-bold text-slate-900 dark:text-neutral-100 tracking-tight'>Properties</h1>
                    <p className='text-slate-600 dark:text-neutral-400 mt-1'>Manage real estate properties.</p>
                </div>
                <Link to='/properties/new'>
                    <Button className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-none'>
                        <Plus className='mr-2 h-4 w-4' /> Create New Property
                    </Button>
                </Link>
            </div>

            <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center'>
                {/* Search Input */}
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search properties..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-transparent border-slate-300 dark:border-neutral-800"
                    />
                </div>

                {/* Status Filter */}
                <div className='flex items-center gap-2 w-full md:w-auto'>
                    <label className='text-sm text-slate-700 dark:text-neutral-400 whitespace-nowrap'>Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className='bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 rounded px-3 py-2 w-full md:w-48 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
                    >
                        <option value=''>All</option>
                        <option value='active'>Active</option>
                        <option value='pending'>Pending</option>
                        <option value='blocked'>Blocked</option>
                    </select>
                </div>
            </div>

            <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none'>
                {/* Initial Loading State - Only show when we have NO data at all */}
                {isLoading && !properties.length ? (
                    <div className='p-8 text-center text-slate-500 dark:text-neutral-500'>Loading properties...</div>
                ) : properties.length === 0 ? (
                    <div className='p-8 text-center text-slate-500 dark:text-neutral-500'>No properties found.</div>
                ) : (
                    <div className="relative">
                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className='w-full text-left'>
                                <thead className='bg-gradient-to-r from-slate-50 to-slate-100 dark:bg-neutral-800 dark:from-transparent dark:to-transparent border-b border-slate-200 dark:border-neutral-800'>
                                    <tr>
                                        <th className='px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300'>Title</th>
                                        <th className='px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300'>Location</th>
                                        <th className='px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300'>Status</th>
                                        <th className='px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300'>Created At</th>
                                        <th className='px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300 text-right'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-slate-100 dark:divide-neutral-800'>
                                    {properties.map((property) => (
                                        <tr key={property._id} className='hover:bg-blue-50/50 dark:hover:bg-neutral-800/60 transition-colors'>
                                            <td className='px-6 py-4 font-medium text-slate-900 dark:text-neutral-100'>{property.title}</td>
                                            <td className='px-6 py-4 text-slate-600 dark:text-neutral-400'>
                                                {property.location?.name || 'Unknown'}, {property.location?.city}
                                            </td>
                                            <td className='px-6 py-4'>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${property.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                        : property.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'
                                                            : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                                        }`}
                                                >
                                                    {property.status}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 text-slate-500 dark:text-slate-400 text-sm'>
                                                {new Date(property.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className='px-6 py-4 text-right space-x-2'>
                                                <Link to={`/properties/${property._id}/edit`}>
                                                    <Button variant='ghost' size='sm' className='hover:bg-blue-100 text-slate-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400'>
                                                        <Edit2 className='h-4 w-4' />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    className={`hover:bg-opacity-10 text-slate-500 hover:text-orange-600 dark:text-neutral-400 ${property.status === 'active' ? 'hover:bg-orange-100 dark:hover:bg-neutral-800 dark:hover:text-orange-400' : 'hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-neutral-800 dark:hover:text-emerald-400'}`}
                                                    onClick={() => handleStatusToggle(property._id, property.status)}
                                                    title={property.status === 'active' ? 'Block Property' : 'Activate Property'}
                                                >
                                                    <Power className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    className='hover:bg-red-100 text-slate-500 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-red-400'
                                                    onClick={() => handleDelete(property._id)}
                                                    title='Delete Property'
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="grid grid-cols-1 gap-4 lg:hidden p-4">
                            {properties.map((property) => (
                                <div key={property._id} className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-slate-900 dark:text-neutral-100">{property.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
                                                {property.location?.name || 'Unknown'}, {property.location?.city}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${property.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                : property.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'
                                                    : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                                }`}
                                        >
                                            {property.status}
                                        </span>
                                    </div>

                                    <div className="text-sm text-slate-500 dark:text-neutral-400">
                                        Created: {new Date(property.createdAt).toLocaleDateString()}
                                    </div>

                                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-neutral-800">
                                        <Link to={`/properties/${property._id}/edit`}>
                                            <Button variant='ghost' size='sm' className='hover:bg-blue-100 text-slate-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400'>
                                                <Edit2 className='h-4 w-4' />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            className={`hover:bg-opacity-10 text-slate-500 hover:text-orange-600 dark:text-neutral-400 ${property.status === 'active' ? 'hover:bg-orange-100 dark:hover:bg-neutral-800 dark:hover:text-orange-400' : 'hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-neutral-800 dark:hover:text-emerald-400'}`}
                                            onClick={() => handleStatusToggle(property._id, property.status)}
                                        >
                                            <Power className='h-4 w-4' />
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            className='hover:bg-red-100 text-slate-500 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-red-400'
                                            onClick={() => handleDelete(property._id)}
                                        >
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Property"
                message="Are you sure you want to delete this property? This action will mark it as deleted."
                confirmText="Delete"
                isLoading={isDeleting}
            />
        </div >
    )
}

export default PropertyList
