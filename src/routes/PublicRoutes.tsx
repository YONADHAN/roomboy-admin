import { Route } from 'react-router-dom';
import { PropertyList } from '@/pages/public/PropertyList';
import { PropertyDetails } from '@/pages/public/PropertyDetails';

const PublicRoutes = () => {
    return (
        <>
            <Route path='/properties' element={<PropertyList />} />
            <Route path='/properties/:slug' element={<PropertyDetails />} />
        </>
    );
};

export default PublicRoutes;
