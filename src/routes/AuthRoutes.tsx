import { Route } from 'react-router-dom'
import PublicRoute from '@/components/PublicRoute'
import Signin from '@/pages/auth/signin'

const AuthRoutes = () => {
    return (
        <Route element={<PublicRoute />}>
            <Route path='/signin' element={<Signin />} />
        </Route>
    )
}

export default AuthRoutes
