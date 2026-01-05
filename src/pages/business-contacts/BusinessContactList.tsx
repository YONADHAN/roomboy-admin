import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContacts, toggleContactStatus, deleteContact } from '@/services/business_contact.service';
import { Button } from '@/components/ui/button';

import { Plus, Edit2, Power, ChevronLeft, ChevronRight, Mail, Phone, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const BusinessContactList = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['business-contacts', page],
        queryFn: () => getContacts({ page, limit })
    });

    const toggleMutation = useMutation({
        mutationFn: toggleContactStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-contacts'] });
            toast.success('Status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-contacts'] });
            toast.success('Contact deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete contact');
        }
    });

    if (isLoading) return <div className="flex justify-center p-8 text-white">Loading contacts...</div>;
    if (isError) return <div className="text-red-500 p-8">Error fetching contacts</div>;

    const contacts = data?.data || [];
    const totalPages = data?.totalPages || 1;

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-neutral-100 tracking-tight">Business Contact</h1>
                    <p className="text-slate-600 dark:text-neutral-400 mt-1">Manage your official business contact information.</p>
                </div>
                {contacts.length === 0 && (
                    <Link to="/business-contacts/new">
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-none">
                            <Plus className="mr-2 h-4 w-4" /> Add Contact
                        </Button>
                    </Link>
                )}
            </div>



            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:bg-neutral-800 dark:from-transparent dark:to-transparent border-b border-slate-200 dark:border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300">Business Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300">Contact Details</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                            {contacts.map((contact) => (
                                <tr key={contact._id} className="hover:bg-blue-50/50 dark:hover:bg-neutral-800/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-slate-900 dark:text-neutral-100 font-medium">{contact.displayName}</div>
                                        <div className="text-slate-500 dark:text-neutral-400 text-xs truncate max-w-[200px]">
                                            {contact.description || 'No description'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 space-y-1">
                                        <div className="flex items-center text-sm text-slate-600 dark:text-neutral-400">
                                            <Mail className="h-3 w-3 mr-2 text-slate-400 dark:text-neutral-500" /> {contact.email || 'N/A'}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-600 dark:text-neutral-400">
                                            <Phone className="h-3 w-3 mr-2 text-slate-400 dark:text-neutral-500" />
                                            {contact.phoneNumbers?.find(p => p.isPrimary)?.number || contact.phoneNumbers?.[0]?.number || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${contact.isActive
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
                                            }`}>
                                            {contact.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-1 text-white">
                                        <Link to={`/business-contacts/${contact._id}/edit`}>
                                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`hover:bg-opacity-10 dark:text-neutral-400 ${contact.isActive ? 'text-slate-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-neutral-800 dark:hover:text-orange-400' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-neutral-800 dark:hover:text-emerald-400'}`}
                                            onClick={() => toggleMutation.mutate(contact._id)}
                                        >
                                            <Power className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-500 hover:text-red-600 hover:bg-red-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-red-400"
                                            onClick={() => handleDelete(contact._id)}
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
                    {contacts.map((contact) => (
                        <div key={contact._id} className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-slate-900 dark:text-neutral-100">{contact.displayName}</h3>
                                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 truncate max-w-[200px]">
                                        {contact.description || 'No description'}
                                    </p>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${contact.isActive
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
                                    }`}>
                                    {contact.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-slate-600 dark:text-neutral-400">
                                    <Mail className="h-3 w-3 mr-2 text-slate-400 dark:text-neutral-500" /> {contact.email || 'N/A'}
                                </div>
                                <div className="flex items-center text-sm text-slate-600 dark:text-neutral-400">
                                    <Phone className="h-3 w-3 mr-2 text-slate-400 dark:text-neutral-500" />
                                    {contact.phoneNumbers?.find(p => p.isPrimary)?.number || contact.phoneNumbers?.[0]?.number || 'N/A'}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-neutral-800">
                                <Link to={`/business-contacts/${contact._id}/edit`}>
                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`hover:bg-opacity-10 dark:text-neutral-400 ${contact.isActive ? 'text-slate-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-neutral-800 dark:hover:text-orange-400' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-neutral-800 dark:hover:text-emerald-400'}`}
                                    onClick={() => toggleMutation.mutate(contact._id)}
                                >
                                    <Power className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-500 hover:text-red-600 hover:bg-red-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-red-400"
                                    onClick={() => handleDelete(contact._id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                {contacts.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No contacts found.
                    </div>
                )}

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
        </div>
    );
};

export default BusinessContactList;
