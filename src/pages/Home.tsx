import { useLogout } from '@/hooks/useAuth'
import { useSelector } from 'react-redux'
import { type RootState } from '@/store/store'
import { Link } from 'react-router-dom'

export default function Home() {
    const { user } = useSelector((state: RootState) => state.auth)
    const { mutate: logout } = useLogout()

    return (
        <div className='p-8'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold'>Welcome, {user?.name || 'Admin'}</h1>
                <button
                    onClick={() => logout()}
                    className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'
                >
                    Logout
                </button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <Link to='/locations' className='p-6 rounded-xl transition-all duration-300 bg-white border border-slate-200 shadow-sm hover:shadow-md dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-none dark:hover:bg-neutral-800/60'>
                    <h3 className='text-xl font-semibold mb-2 text-slate-900 dark:text-neutral-100'>Locations</h3>
                    <p className='text-slate-600 dark:text-neutral-400 text-sm'>Manage city-wise locations for room listings.</p>
                </Link>

                <Link to='/properties' className='p-6 rounded-xl transition-all duration-300 bg-white border border-slate-200 shadow-sm hover:shadow-md dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-none dark:hover:bg-neutral-800/60'>
                    <h3 className='text-xl font-semibold mb-2 text-slate-900 dark:text-neutral-100'>Properties</h3>
                    <p className='text-slate-600 dark:text-neutral-400 text-sm'>Manage real estate properties.</p>
                </Link>

                <Link to='/field-definitions' className='p-6 rounded-xl transition-all duration-300 bg-white border border-slate-200 shadow-sm hover:shadow-md dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-none dark:hover:bg-neutral-800/60'>
                    <h3 className='text-xl font-semibold mb-2 text-slate-900 dark:text-neutral-100'>Field Definitions</h3>
                    <p className='text-slate-600 dark:text-neutral-400 text-sm'>Manage dynamic field configurations.</p>
                </Link>
                <Link to='/business-contacts' className='p-6 rounded-xl transition-all duration-300 bg-white border border-slate-200 shadow-sm hover:shadow-md dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-none dark:hover:bg-neutral-800/60'>
                    <h3 className='text-xl font-semibold mb-2 text-slate-900 dark:text-neutral-100'>Business Contacts</h3>
                    <p className='text-slate-600 dark:text-neutral-400 text-sm'>Manage your team and business associates.</p>
                </Link>
            </div>
            <p className='mt-8 text-slate-500 text-sm italic'>Room app internal dashboard</p>
        </div>
    )
}
