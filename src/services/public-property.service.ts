import api from '@/api/axios';

export interface IFieldDefinition {
    _id: string;
    entityType: 'property' | 'product' | 'service';
    fieldKey: string;
    label: string;
    dataType: 'string' | 'number' | 'boolean' | 'select' | 'multi-select';
    required: boolean;
    options?: string[];
    rules?: {
        min?: number;
        max?: number;
        regex?: string;
    };
    isActive: boolean;
    createdAt: string;
}

export interface IProperty {
    _id: string;
    propertyId: string;
    title: string;
    entityType: 'property';
    attributes: Record<string, any>;
    location?: {
        city?: string;
        locality?: string;
        latitude?: number;
        longitude?: number;
    };
    images: string[];
    status: 'active' | 'blocked' | 'pending';
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IPropertyListResponse {
    data: IProperty[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IPropertyQueryParams {
    city?: string;
    locality?: string;
    search?: string;
    page?: number;
    limit?: number;
    [key: string]: any; // For dynamic attribute filters
}

export const getPublicProperties = async (params: IPropertyQueryParams = {}): Promise<IPropertyListResponse> => {
    const res = await api.get('/api/v1/public/properties', { params });
    return res.data;
};

export const getPublicPropertyById = async (id: string): Promise<IProperty> => {
    const res = await api.get(`/api/v1/public/properties/${id}`);
    return res.data;
};

export const getPublicPropertyBySlug = async (slug: string): Promise<IProperty> => {
    const res = await api.get(`/api/v1/public/properties/slug/${slug}`);
    return res.data;
};

export const getFieldDefinitions = async (entityType: 'property' | 'product' | 'service'): Promise<IFieldDefinition[]> => {
    const res = await api.get('/api/v1/public/field-definitions', {
        params: { entityType },
    });
    return res.data;
};
