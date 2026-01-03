import { useParams, useNavigate } from 'react-router-dom';
import { usePublicPropertyBySlug } from '@/hooks/usePublicProperties';
import { useFieldDefinitions } from '@/hooks/usePublicProperties';

export const PropertyDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const { property, loading, error } = usePublicPropertyBySlug(slug || '');
    const { fieldDefinitions } = useFieldDefinitions('property');

    // Create a map of field keys to labels
    const fieldLabels = fieldDefinitions.reduce((acc, field) => {
        acc[field.fieldKey] = field.label;
        return acc;
    }, {} as Record<string, string>);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <p className="text-center text-gray-600">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">{error || 'Property not found'}</p>
                    </div>
                    <button
                        onClick={() => navigate('/listings')}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        ← Back to properties
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/listings')}
                    className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                    <span>←</span> Back to properties
                </button>

                {/* Property Details Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Images */}
                    {property.images.length > 0 && (
                        <div className="w-full">
                            <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-96 object-cover"
                            />
                            {property.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 p-4">
                                    {property.images.slice(1, 5).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${property.title} ${index + 2}`}
                                            className="w-full h-24 object-cover rounded"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="p-6">
                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>

                        {/* Location */}
                        {property.location && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-700 mb-2">Location</h2>
                                <p className="text-gray-600">
                                    {property.location.locality && `${property.location.locality}, `}
                                    {property.location.city}
                                </p>
                                {property.location.latitude && property.location.longitude && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Coordinates: {property.location.latitude}, {property.location.longitude}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Dynamic Attributes */}
                        {Object.keys(property.attributes).length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(property.attributes).map(([key, value]) => (
                                        <div key={key} className="border-b pb-2">
                                            <p className="text-sm font-medium text-gray-700">
                                                {fieldLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </p>
                                            <p className="text-gray-900">
                                                {Array.isArray(value) ? value.join(', ') : String(value)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="border-t pt-4 mt-6">
                            <p className="text-xs text-gray-500">
                                Property ID: {property.propertyId}
                            </p>
                            <p className="text-xs text-gray-500">
                                Listed on: {new Date(property.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
