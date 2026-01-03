import { useNavigate, useParams } from 'react-router-dom';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createContact, updateContact, getContactById, type IBusinessContactCreate } from '@/services/business_contact.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Loader2, Plus, Trash2, Facebook, Instagram, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ContactSchema = Yup.object().shape({
  displayName: Yup.string().min(2, 'Name is too short').required('Business name is required'),
  description: Yup.string().max(200, 'Description too long'),
  phoneNumbers: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required('Label required'),
      number: Yup.string().min(10, 'Invalid phone').required('Number required'),
      isPrimary: Yup.boolean(),
    })
  ).min(1, 'At least one phone number is required'),
  email: Yup.string().email('Invalid email'),
  socialLinks: Yup.array().of(
    Yup.object().shape({
      platform: Yup.string().oneOf(['facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp']),
      url: Yup.string().url('Invalid URL').required('URL required'),
    })
  ),
  website: Yup.string().url('Invalid website URL'),
  isActive: Yup.boolean().default(true),
});

const socialIcons: Record<string, any> = {
  facebook: <Facebook className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
};

const BusinessContactForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const { data: contact, isLoading: isFetching } = useQuery({
    queryKey: ['business-contacts', id],
    queryFn: () => getContactById(id!),
    enabled: isEdit,
    retry: false
  });

  const mutation = useMutation({
    mutationFn: (data: IBusinessContactCreate) =>
      isEdit ? updateContact(id!, data) : createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-contacts'] });
      toast.success(`Contact ${isEdit ? 'updated' : 'created'} successfully`);
      navigate('/business-contacts');
    },
    onError: (err: any) => {
      console.error('Contact error:', err);
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(message);
    }
  });

  const formik = useFormik({
    initialValues: {
      displayName: contact?.displayName || '',
      description: contact?.description || '',
      phoneNumbers: contact?.phoneNumbers || [{ label: 'Primary', number: '', isPrimary: true }],
      email: contact?.email || '',
      socialLinks: contact?.socialLinks || [],
      website: contact?.website || '',
      isActive: contact?.isActive ?? true,
    },
    enableReinitialize: true,
    validationSchema: ContactSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  if (isEdit && isFetching) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 animate-pulse">Fetching contact data...</p>
      </div>
    );
  }

  return (
    <FormikProvider value={formik}>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4 mb-2">
          <Link to="/business-contacts" className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-slate-500 dark:text-neutral-400" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-neutral-100 tracking-tight">
            {isEdit ? 'Edit Contact' : 'New Contact'}
          </h1>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm dark:shadow-none space-y-6">
            <h2 className="text-xl font-semibold border-b border-slate-200 dark:border-neutral-800 pb-2 text-slate-900 dark:text-neutral-100">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-neutral-300">Display Name / Business Name</label>
                <Input
                  name="displayName"
                  value={formik.values.displayName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 focus:ring-blue-500"
                  placeholder="e.g. Roomboy HQ"
                />
                {formik.touched.displayName && formik.errors.displayName && (
                  <p className="text-xs text-red-500 dark:text-red-400">{String(formik.errors.displayName)}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-neutral-300">Description / Tagline</label>
                <Input
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 focus:ring-blue-500"
                  placeholder="e.g. Best Room Booking Service"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-neutral-300">Official Email</label>
                <Input
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 focus:ring-blue-500"
                  placeholder="contact@roomboy.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-neutral-300">Website URL</label>
                <Input
                  name="website"
                  value={formik.values.website}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 focus:ring-blue-500"
                  placeholder="https://roomboy.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-neutral-800 pb-2">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-neutral-100">Phone Numbers</h2>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => formik.setFieldValue('phoneNumbers', [...formik.values.phoneNumbers, { label: 'Support', number: '', isPrimary: false }])}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-600/20 dark:text-blue-400 dark:hover:bg-blue-600/30 shadow-none border-none"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Phone
                </Button>
              </div>

              <FieldArray
                name="phoneNumbers"
                render={arrayHelpers => (
                  <div className="space-y-4">
                    {formik.values.phoneNumbers.map((phone, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500 dark:text-neutral-400">Label</label>
                          <Input
                            name={`phoneNumbers.${index}.label`}
                            value={phone.label}
                            onChange={formik.handleChange}
                            className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 h-9 text-slate-900 dark:text-neutral-100"
                            placeholder="Primary"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs text-slate-500 dark:text-neutral-400">Number</label>
                          <Input
                            name={`phoneNumbers.${index}.number`}
                            value={phone.number}
                            onChange={formik.handleChange}
                            className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 h-9 text-slate-900 dark:text-neutral-100"
                            placeholder="9876543210"
                          />
                        </div>
                        <div className="flex items-center space-x-2 pb-2">
                          <input
                            type="checkbox"
                            checked={phone.isPrimary}
                            onChange={() => {
                              const updated = formik.values.phoneNumbers.map((p, i) => ({
                                ...p,
                                isPrimary: i === index
                              }));
                              formik.setFieldValue('phoneNumbers', updated);
                            }}
                            className="h-4 w-4 rounded border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-blue-600"
                          />
                          <span className="text-sm text-slate-600 dark:text-neutral-300">Primary</span>
                          {formik.values.phoneNumbers.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => arrayHelpers.remove(index)}
                              className="text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 ml-auto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-neutral-800 pb-2">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-neutral-100">Social Links</h2>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => formik.setFieldValue('socialLinks', [...formik.values.socialLinks, { platform: 'whatsapp', url: '' }])}
                  className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-600/20 dark:text-indigo-400 dark:hover:bg-indigo-600/30 shadow-none border-none"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Link
                </Button>
              </div>

              <FieldArray
                name="socialLinks"
                render={arrayHelpers => (
                  <div className="space-y-4">
                    {formik.values.socialLinks.map((link, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500 dark:text-neutral-400">Platform</label>
                          <select
                            name={`socialLinks.${index}.platform`}
                            value={link.platform}
                            onChange={formik.handleChange}
                            className="w-full bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 rounded-md p-2 text-sm h-9 text-slate-900 dark:text-neutral-100"
                          >
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="twitter">Twitter</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="whatsapp">WhatsApp</option>
                          </select>
                        </div>
                        <div className="md:col-span-1 space-y-1">
                          <label className="text-xs text-slate-500 dark:text-neutral-400">URL</label>
                          <Input
                            name={`socialLinks.${index}.url`}
                            value={link.url}
                            onChange={formik.handleChange}
                            className="bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 h-9 text-slate-900 dark:text-neutral-100"
                            placeholder="https://..."
                          />
                        </div>
                        <div className="flex items-center pb-2">
                          <div className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-md">
                            {socialIcons[link.platform]}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => arrayHelpers.remove(index)}
                            className="text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 ml-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {formik.values.socialLinks.length === 0 && (
                      <p className="text-sm text-slate-500 italic">No social links added.</p>
                    )}
                  </div>
                )}
              />
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
                Set as active contact
              </label>
            </div>

            <div className="flex justify-end pt-4 space-x-4">
              <Link to="/business-contacts">
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
                {isEdit ? 'Update Contact' : 'Create Contact'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </FormikProvider>
  );
};

export default BusinessContactForm;
