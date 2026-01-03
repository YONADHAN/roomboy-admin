import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getProperties, type IProperty, updatePropertyStatus, deleteProperty } from '@/services/property.service'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Power, Trash2 } from 'lucide-react'

const PropertyList = () => {
    const [properties, setProperties] = useState<IProperty[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('')

    const fetchProperties = async () => {
        setLoading(true)
        try {
            const res = await getProperties({ limit: 100, status: statusFilter || undefined })
            setProperties(res.data)
        } catch (error) {
            toast.error('Failed to fetch properties')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
            await updatePropertyStatus(id, newStatus)
            toast.success(`Property ${newStatus === 'active' ? 'activated' : 'blocked'} successfully`)
            fetchProperties()
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return
        try {
            await deleteProperty(id)
            toast.success('Property deleted successfully')
            fetchProperties()
        } catch (error) {
            toast.error('Failed to delete property')
        }
    }

    useEffect(() => {
        fetchProperties()
    }, [statusFilter])

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

            <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-4 mb-6 shadow-sm'>
                <label className='text-sm text-slate-700 dark:text-neutral-400 mb-2 block'>Filter by Status</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className='bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 rounded px-3 py-2 w-48 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
                >
                    <option value=''>All Statuses</option>
                    <option value='active'>Active</option>
                    <option value='pending'>Pending</option>
                    <option value='blocked'>Blocked</option>
                </select>
            </div>

            <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none'>
                {loading ? (
                    <div className='p-8 text-center text-slate-500 dark:text-neutral-500'>Loading properties...</div>
                ) : properties.length === 0 ? (
                    <div className='p-8 text-center text-slate-500 dark:text-neutral-500'>No properties found.</div>
                ) : (
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
                                        {property.location?.city}, {property.location?.locality}
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
                )}
            </div>
        </div>
    )
}

export default PropertyList
