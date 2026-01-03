import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { AdminLayout } from '@/components/layout/AdminLayout'

const PrivateRoute = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)

    return isAuthenticated ? (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    ) : <Navigate to='/signin' replace />
}

export default PrivateRoute
