import type { IProperty } from '@/services/public-property.service';

interface PropertyCardProps {
    property: IProperty;
    onClick: (slug: string) => void;
}

export const PropertyCard = ({ property, onClick }: PropertyCardProps) => {
    const firstThreeAttributes = Object.entries(property.attributes).slice(0, 3);

    return (
        <div
            onClick={() => onClick(property.propertyId)}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white"
        >
            {/* Images */}
            {property.images.length > 0 && (
                <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-md mb-3"
                />
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2">{property.title}</h3>

            {/* Location */}
            {property.location && (
                <p className="text-sm text-gray-600 mb-2">
                    {property.location.locality && `${property.location.locality}, `}
                    {property.location.city}
                </p>
            )}

            {/* Key Attributes (first 3) */}
            {firstThreeAttributes.length > 0 && (
                <div className="space-y-1">
                    {firstThreeAttributes.map(([key, value]) => (
                        <p key={key} className="text-sm text-gray-700">
                            <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};
