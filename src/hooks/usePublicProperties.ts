import { useState, useEffect } from 'react';
import {
    getPublicProperties,
    getPublicPropertyById,
    getPublicPropertyBySlug,
    getFieldDefinitions,
} from '@/services/public-property.service';
import type {
    IProperty,
    IPropertyListResponse,
    IPropertyQueryParams,
    IFieldDefinition,
} from '@/services/public-property.service';

export const usePublicProperties = (params: IPropertyQueryParams) => {
    const [data, setData] = useState<IPropertyListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getPublicProperties(params);
                setData(result);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch properties');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [JSON.stringify(params)]);

    return { data, loading, error };
};

export const usePublicPropertyById = (id: string) => {
    const [property, setProperty] = useState<IProperty | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getPublicPropertyById(id);
                setProperty(result);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch property');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id]);

    return { property, loading, error };
};

export const usePublicPropertyBySlug = (slug: string) => {
    const [property, setProperty] = useState<IProperty | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getPublicPropertyBySlug(slug);
                setProperty(result);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch property');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProperty();
        }
    }, [slug]);

    return { property, loading, error };
};

export const useFieldDefinitions = (entityType: 'property' | 'product' | 'service') => {
    const [fieldDefinitions, setFieldDefinitions] = useState<IFieldDefinition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFieldDefinitions = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getFieldDefinitions(entityType);
                setFieldDefinitions(result);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch field definitions');
            } finally {
                setLoading(false);
            }
        };

        fetchFieldDefinitions();
    }, [entityType]);

    return { fieldDefinitions, loading, error };
};
