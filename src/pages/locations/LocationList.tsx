import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLocations, toggleLocationStatus, deleteLocation } from '@/services/location.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Power, ChevronLeft, ChevronRight, Search, Trash2 } from 'lucide-react';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { Link } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const LocationList = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    const limit = 10;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['locations', page, debouncedSearch],
        queryFn: () => getLocations({ page, limit, search: debouncedSearch }),
        placeholderData: keepPreviousData,
    });

    const toggleMutation = useMutation({
        mutationFn: toggleLocationStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            toast.success('Status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });

    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: deleteLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            toast.success('Location deleted successfully');
            closeDeleteModal();
        },
        onError: () => {
            toast.error('Failed to delete location');
            closeDeleteModal();
        }
    });

    const openDeleteModal = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setItemToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            deleteMutation.mutate(itemToDelete);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8 text-white">Loading locations...</div>;
    if (isError) return <div className="text-red-500 p-8">Error fetching locations</div>;

    const locations = data?.data || [];
    const totalPages = data?.totalPages || 1;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-neutral-100 tracking-tight">Locations</h1>
                    <p className="text-slate-600 dark:text-neutral-400 mt-1">Manage your room locations and cities.</p>
                </div>
                <Link to="/locations/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-none">
                        <Plus className="mr-2 h-4 w-4" /> Add Location
                    </Button>
                </Link>
            </div>

            <div className="flex items-center space-x-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-2 max-w-md shadow-sm">
                <Search className="h-4 w-4 text-slate-400 ml-2" />
                <Input
                    placeholder="Search name or city..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="bg-transparent border-none text-slate-900 dark:text-neutral-100 focus:ring-0 placeholder:text-slate-400 h-8"
                />
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:bg-neutral-800 dark:from-transparent dark:to-transparent border-b border-slate-200 dark:border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300">Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300">City</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300">Slug</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                            {locations.map((location) => (
                                <tr key={location._id} className="hover:bg-blue-50/50 dark:hover:bg-neutral-800/60 transition-colors">
                                    <td className="px-6 py-4 text-slate-900 dark:text-neutral-100 font-medium">{location.name}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-neutral-400">{location.city}</td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-neutral-400 text-sm">{location.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${location.isActive
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
                                            }`}>
                                            {location.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2 text-white">
                                        <Link to={`/locations/${location._id}/edit`}>
                                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`hover:bg-opacity-10 text-slate-500 hover:text-orange-600 dark:text-neutral-400 ${location.isActive ? 'hover:bg-orange-100 dark:hover:bg-neutral-800 dark:hover:text-orange-400' : 'hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-neutral-800 dark:hover:text-emerald-400'}`}
                                            onClick={() => toggleMutation.mutate(location._id)}
                                            title={location.isActive ? 'Deactivate' : 'Activate'}
                                        >
                                            <Power className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-red-100 text-slate-500 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-red-400"
                                            onClick={() => openDeleteModal(location._id)}
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="grid grid-cols-1 gap-4 lg:hidden p-4">
                    {locations.map((location) => (
                        <div key={location._id} className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-slate-900 dark:text-neutral-100">{location.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">{location.city}</p>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${location.isActive
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
                                    }`}>
                                    {location.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="text-sm text-slate-500 dark:text-neutral-400 font-mono">
                                {location.slug}
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-neutral-800">
                                <Link to={`/locations/${location._id}/edit`}>
                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`hover:bg-opacity-10 dark:text-neutral-400 ${location.isActive ? 'text-slate-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-neutral-800 dark:hover:text-orange-400' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-neutral-800 dark:hover:text-emerald-400'}`}
                                    onClick={() => toggleMutation.mutate(location._id)}
                                >
                                    <Power className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                {locations.length === 0 && (
                    <div className="p-12 text-center text-slate-500 dark:text-neutral-500">
                        No locations found.
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50 dark:bg-neutral-900 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                        <p className="text-sm text-slate-500 dark:text-neutral-400">
                            Page <span className="text-slate-900 dark:text-neutral-100 font-medium">{page}</span> of <span className="text-slate-900 dark:text-neutral-100 font-medium">{totalPages}</span>
                        </p>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(prev => prev - 1)}
                                className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 disabled:opacity-30"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === totalPages}
                                onClick={() => setPage(prev => prev + 1)}
                                className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 disabled:opacity-30"
                            >
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Location"
                message="Are you sure you want to delete this location? This action simply marks it as deleted and removes it from this list, but does not completely remove it from the system."
                confirmText="Delete"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};

export default LocationList;
