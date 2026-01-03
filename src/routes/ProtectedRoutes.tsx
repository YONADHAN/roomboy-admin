
import { Route } from 'react-router-dom'
import PrivateRoute from '@/components/PrivateRoute'

// Pages
import Home from '@/pages/Home'

// Locations
import LocationList from '@/pages/locations/LocationList'
import LocationForm from '@/pages/locations/LocationForm'

// Field Definitions
import FieldDefinitionList from '@/pages/field-definitions/FieldDefinitionList'
import FieldDefinitionForm from '@/pages/field-definitions/FieldDefinitionForm'

// Properties
import PropertyList from '../pages/properties/PropertyList'
import PropertyForm from '@/pages/properties/PropertyForm'

// Business Contacts
import BusinessContactList from '@/pages/business-contacts/BusinessContactList'
import BusinessContactForm from '@/pages/business-contacts/BusinessContactForm'

const ProtectedRoutes = () => {
    return (
        <Route element={<PrivateRoute />}>
            {/* Dashboard */}
            <Route path='/' element={<Home />} />

            {/* Locations */}
            <Route path='/locations' element={<LocationList />} />
            <Route path='/locations/new' element={<LocationForm />} />
            <Route path='/locations/:id/edit' element={<LocationForm />} />

            {/* Field Definitions (Dynamic Fields) */}
            <Route path='/field-definitions' element={<FieldDefinitionList />} />
            <Route path='/field-definitions/new' element={<FieldDefinitionForm />} />
            <Route path='/field-definitions/:id/edit' element={<FieldDefinitionForm />} />

            {/* Properties */}
            <Route path='/properties' element={<PropertyList />} />
            <Route path='/properties/new' element={<PropertyForm />} />
            <Route path='/properties/:id/edit' element={<PropertyForm />} />

            {/* Business Contacts */}
            <Route path='/business-contacts' element={<BusinessContactList />} />
            <Route path='/business-contacts/new' element={<BusinessContactForm />} />
            <Route path='/business-contacts/:id/edit' element={<BusinessContactForm />} />
        </Route>
    )
}

export default ProtectedRoutes
