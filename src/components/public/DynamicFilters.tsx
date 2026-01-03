import { useState, useEffect } from 'react';
import type { IFieldDefinition } from '@/services/public-property.service';

interface DynamicFiltersProps {
    fieldDefinitions: IFieldDefinition[];
    onFilterChange: (filters: Record<string, any>) => void;
}

export const DynamicFilters = ({ fieldDefinitions, onFilterChange }: DynamicFiltersProps) => {
    const [filters, setFilters] = useState<Record<string, any>>({});

    useEffect(() => {
        onFilterChange(filters);
    }, [filters]);

    const handleFilterChange = (fieldKey: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [fieldKey]: value,
        }));
    };

    const handleMinMaxChange = (fieldKey: string, type: 'min' | 'max', value: string) => {
        const key = `${fieldKey}_${type}`;
        setFilters((prev) => {
            const newFilters = { ...prev };
            if (value === '') {
                delete newFilters[key];
            } else {
                newFilters[key] = Number(value);
            }
            return newFilters;
        });
    };

    const clearFilters = () => {
        setFilters({});
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fieldDefinitions.map((field) => {
                    switch (field.dataType) {
                        case 'number':
                            return (
                                <div key={field.fieldKey} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters[`${field.fieldKey}_min`] || ''}
                                            onChange={(e) => handleMinMaxChange(field.fieldKey, 'min', e.target.value)}
                                            className="w-1/2 px-3 py-2 border rounded-md text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters[`${field.fieldKey}_max`] || ''}
                                            onChange={(e) => handleMinMaxChange(field.fieldKey, 'max', e.target.value)}
                                            className="w-1/2 px-3 py-2 border rounded-md text-sm"
                                        />
                                    </div>
                                </div>
                            );

                        case 'boolean':
                            return (
                                <div key={field.fieldKey} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={field.fieldKey}
                                        checked={filters[field.fieldKey] || false}
                                        onChange={(e) => handleFilterChange(field.fieldKey, e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <label htmlFor={field.fieldKey} className="text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                </div>
                            );

                        case 'select':
                            return (
                                <div key={field.fieldKey} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                    <select
                                        value={filters[field.fieldKey] || ''}
                                        onChange={(e) => handleFilterChange(field.fieldKey, e.target.value || undefined)}
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                    >
                                        <option value="">All</option>
                                        {field.options?.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );

                        case 'multi-select':
                            return (
                                <div key={field.fieldKey} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                    <select
                                        multiple
                                        value={filters[field.fieldKey] || []}
                                        onChange={(e) => {
                                            const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                                            handleFilterChange(field.fieldKey, selected.length > 0 ? selected : undefined);
                                        }}
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                        size={3}
                                    >
                                        {field.options?.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );

                        case 'string':
                            return (
                                <div key={field.fieldKey} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                    <input
                                        type="text"
                                        value={filters[field.fieldKey] || ''}
                                        onChange={(e) => handleFilterChange(field.fieldKey, e.target.value || undefined)}
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                    />
                                </div>
                            );

                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
};
