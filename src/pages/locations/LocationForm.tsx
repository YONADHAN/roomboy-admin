import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createLocation, updateLocation, getLocationById, type ILocationCreate } from '@/services/location.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const LocationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name is too short')
        .max(50, 'Name is too long')
        .required('Name is required'),
    city: Yup.string()
        .min(2, 'City is too short')
        .max(50, 'City is too long')
        .required('City is required'),
    state: Yup.string()
        .min(2, 'State is too short')
        .max(50, 'State is too long')
        .required('State is required'),
    description: Yup.string().max(200, 'Description is too long').optional(),
    isActive: Yup.boolean().default(true),
});

const LocationForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = Boolean(id);

    const { data: location, isLoading: isFetching } = useQuery({
        queryKey: ['locations', id],
        queryFn: () => getLocationById(id!),
        enabled: isEdit,
        retry: false
    });

    const mutation = useMutation({
        mutationFn: (data: ILocationCreate) =>
            isEdit ? updateLocation(id!, data) : createLocation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            toast.success(`Location ${isEdit ? 'updated' : 'created'} successfully`);
            navigate('/locations');
        },
        onError: (err: any) => {
            console.error('Location creation error:', err);
            const message = err.response?.data?.message || err.message || 'Something went wrong';
            toast.error(message);
        }
    });

    const formik = useFormik({
        initialValues: {
            name: location?.name || '',
            city: location?.city || '',
            state: location?.state || '',
            description: location?.description || '',
            isActive: location?.isActive ?? true,
        },
        enableReinitialize: true,
        validationSchema: LocationSchema,
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    if (isEdit && isFetching) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                <p className="text-slate-500 dark:text-slate-400 animate-pulse">Fetching location data...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4 mb-2">
                <Link to="/locations" className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                    <ArrowLeft className="h-6 w-6 text-slate-500 dark:text-neutral-400" />
                </Link>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-neutral-100 tracking-tight">
                    {isEdit ? 'Edit Location' : 'New Location'}
                </h1>
            </div>

            <form onSubmit={formik.handleSubmit} className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm dark:shadow-none space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-neutral-300">Location Name</label>
                        <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. Kakkanad Office"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-xs text-red-500 dark:text-red-400">{String(formik.errors.name)}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-neutral-300">City</label>
                        <Input
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. Kochi"
                        />
                        {formik.touched.city && formik.errors.city && (
                            <p className="text-xs text-red-500 dark:text-red-400">{String(formik.errors.city)}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-neutral-300">State</label>
                        <Input
                            name="state"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. Kerala"
                        />
                        {formik.touched.state && formik.errors.state && (
                            <p className="text-xs text-red-500 dark:text-red-400">{String(formik.errors.state)}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-neutral-300">Description (Optional)</label>
                        <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            rows={3}
                            className="w-full rounded-md bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 p-3 text-sm focus:ring-blue-500 focus:outline-none focus:border-blue-500 placeholder:text-slate-400 dark:placeholder:text-neutral-500"
                            placeholder="Brief description of the location..."
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="text-xs text-red-500 dark:text-red-400">{String(formik.errors.description)}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formik.values.isActive}
                            onChange={formik.handleChange}
                            className="h-4 w-4 rounded border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="text-sm text-slate-700 dark:text-neutral-300">
                            Set as active location
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4 space-x-4">
                    <Link to="/locations">
                        <Button type="button" variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800">
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-none px-8"
                    >
                        {mutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {isEdit ? 'Update Changes' : 'Create Location'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default LocationForm;
