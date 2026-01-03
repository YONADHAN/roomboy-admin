import { Formik, Form, Field } from 'formik'
import { signinValidationSchema } from '@/validations/auth/auth.yup'
import { useSignin } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

export default function Signin() {
  const { mutate, isPending } = useSignin()

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4'>
      <div className='w-full max-w-md bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-800 p-8 animate-in fade-in zoom-in duration-500'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400'>
            Welcome Back
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mt-2'>
            Enter your credentials to access your account
          </p>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={signinValidationSchema}
          onSubmit={(values) => {
            mutate(values)
          }}
        >
          {({ errors, touched }) => (
            <Form className='space-y-6'>
              <div className='space-y-4'>
                <Field name='email'>
                  {({ field }: any) => (
                    <Input
                      {...field}
                      type='email'
                      placeholder='name@example.com'
                      label='Email Address'
                      error={touched.email && errors.email ? errors.email : ''}
                    />
                  )}
                </Field>

                <Field name='password'>
                  {({ field }: any) => (
                    <Input
                      {...field}
                      type='password'
                      placeholder='••••••••'
                      label='Password'
                      error={
                        touched.password && errors.password
                          ? errors.password
                          : ''
                      }
                    />
                  )}
                </Field>
              </div>

              <button
                type='submit'
                disabled={isPending}
                className='w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.98]'
              >
                {isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
