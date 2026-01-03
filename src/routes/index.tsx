import { Routes, Route } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'

// Public Pages
import { PropertyList as PublicPropertyList } from '@/pages/public/PropertyList'
import { PropertyDetails } from '@/pages/public/PropertyDetails'

// Auth Pages & Components
import PublicRoute from '@/components/PublicRoute'
import Signin from '@/pages/auth/signin'

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes (NO auth) */}
            {/* Public routes (NO auth) */}
            <Route path='/listings' element={<PublicPropertyList />} />
            <Route path='/listings/:slug' element={<PropertyDetails />} />

            {/* Auth routes (login etc.) */}
            <Route element={<PublicRoute />}>
                <Route path='/signin' element={<Signin />} />
            </Route>

            {/* Admin routes (auth required) */}
            {ProtectedRoutes()}
        </Routes>
    )
}

export default AppRoutes
