import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { changePasswordApi, logoutApi } from '@/services/auth.service'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, LockKeyhole } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearUser } from '@/store/auth.slice'

const changePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required('Current password is required'),
    newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required')
        .notOneOf([Yup.ref('currentPassword')], 'New password must be different from current password'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
})

const ChangePassword = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { mutate, isPending } = useMutation({
        mutationFn: changePasswordApi,
        onSuccess: async () => {
            toast.success('Password changed successfully. Please login again.')
            // Logout user
            try {
                await logoutApi()
            } catch (e) {
                console.error('Logout failed', e)
            }
            dispatch(clearUser())
            navigate('/signin')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to change password'
            toast.error(message)
        },
    })

    return (
        <div className='p-6 space-y-6 max-w-2xl mx-auto'>
            <div className='flex items-center gap-3 mb-6'>
                <div className='p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg'>
                    <LockKeyhole className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                    <h1 className='text-3xl font-bold text-slate-900 dark:text-neutral-100 tracking-tight'>Change Password</h1>
                    <p className='text-slate-600 dark:text-neutral-400 mt-1'>Update your account password securely.</p>
                </div>
            </div>

            <div className='bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm'>
                <Formik
                    initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                    validationSchema={changePasswordSchema}
                    onSubmit={(values) => {
                        mutate({ current: values.currentPassword, new: values.newPassword })
                    }}
                >
                    {({ errors, touched, isValid, dirty }) => (
                        <Form className='space-y-6'>
                            <div className='space-y-4'>
                                <Field name='currentPassword'>
                                    {({ field }: any) => (
                                        <Input
                                            {...field}
                                            type='password'
                                            label='Current Password'
                                            placeholder='Enter current password'
                                            error={touched.currentPassword && errors.currentPassword ? errors.currentPassword : ''}
                                        />
                                    )}
                                </Field>

                                <div className='pt-2 border-t border-slate-100 dark:border-neutral-800'></div>

                                <Field name='newPassword'>
                                    {({ field }: any) => (
                                        <Input
                                            {...field}
                                            type='password'
                                            label='New Password'
                                            placeholder='Enter new password'
                                            error={touched.newPassword && errors.newPassword ? errors.newPassword : ''}
                                        />
                                    )}
                                </Field>

                                <Field name='confirmPassword'>
                                    {({ field }: any) => (
                                        <Input
                                            {...field}
                                            type='password'
                                            label='Confirm New Password'
                                            placeholder='Confirm new password'
                                            error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''}
                                        />
                                    )}
                                </Field>
                            </div>

                            <div className='flex justify-end pt-4'>
                                <Button
                                    type='submit'
                                    disabled={isPending || !isValid || !dirty}
                                    className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white min-w-[140px]'
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default ChangePassword
