import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePublicProperties } from '@/hooks/usePublicProperties';
import { useFieldDefinitions } from '@/hooks/usePublicProperties';
import { PropertyCard } from '@/components/public/PropertyCard';
import { DynamicFilters } from '@/components/public/DynamicFilters';

export const PropertyList = () => {
    const navigate = useNavigate();
    const [, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState<Record<string, any>>({});
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');
    const [locality, setLocality] = useState('');

    // Fetch field definitions for dynamic filters
    const { fieldDefinitions, loading: loadingFields } = useFieldDefinitions('property');

    // Build query params
    const queryParams = {
        page,
        limit: 20,
        ...(search && { search }),
        ...(city && { city }),
        ...(locality && { locality }),
        ...filters,
    };

    // Fetch properties
    const { data, loading, error } = usePublicProperties(queryParams);

    // Update URL params when filters change
    useEffect(() => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (city) params.city = city;
        if (locality) params.locality = locality;
        if (page > 1) params.page = String(page);

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params[key] = String(value);
            }
        });

        setSearchParams(params);
    }, [filters, search, city, locality, page]);

    const handlePropertyClick = (slug: string) => {
        navigate(`/listings/${slug}`);
    };

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
        setPage(1); // Reset to first page when filters change
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Properties</h1>

                    {/* Search and Location Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="px-4 py-2 border rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                                setPage(1);
                            }}
                            className="px-4 py-2 border rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Locality"
                            value={locality}
                            onChange={(e) => {
                                setLocality(e.target.value);
                                setPage(1);
                            }}
                            className="px-4 py-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Dynamic Filters */}
                {!loadingFields && fieldDefinitions.length > 0 && (
                    <DynamicFilters
                        fieldDefinitions={fieldDefinitions}
                        onFilterChange={handleFilterChange}
                    />
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading properties...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Properties Grid */}
                {!loading && data && (
                    <>
                        {data.data.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600">No properties found. Try adjusting your filters.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {data.data.map((property) => (
                                        <PropertyCard
                                            key={property._id}
                                            property={property}
                                            onClick={handlePropertyClick}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {data.pagination.totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-4">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-700">
                                            Page {data.pagination.page} of {data.pagination.totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                                            disabled={page === data.pagination.totalPages}
                                            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}

                                {/* Results Count */}
                                <p className="text-center text-sm text-gray-600 mt-4">
                                    Showing {data.data.length} of {data.pagination.total} properties
                                </p>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
