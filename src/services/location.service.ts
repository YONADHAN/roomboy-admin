import api from '@/api/axios';

export interface ILocation {
    _id: string;
    name: string;
    city: string;
    slug: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ILocationCreate {
    name: string;
    city: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
}

export interface ILocationResponse {
    data: ILocation[];
    currentPage: number;
    totalPages: number;
}

export const getLocations = async (params: { page?: number; limit?: number; search?: string } = {}): Promise<ILocationResponse> => {
    const res = await api.get('/api/v1/admin/locations', { params });
    return res.data;
};

export const getLocationById = async (id: string): Promise<ILocation> => {
    const res = await api.get(`/api/v1/admin/locations/${id}`);
    return res.data;
};

export const createLocation = async (data: ILocationCreate): Promise<ILocation> => {
    const res = await api.post('/api/v1/admin/locations', data);
    return res.data;
};

export const updateLocation = async (id: string, data: Partial<ILocationCreate>): Promise<ILocation> => {
    const res = await api.put(`/api/v1/admin/locations/${id}`, data);
    return res.data;
};

export const toggleLocationStatus = async (id: string): Promise<ILocation> => {
    const res = await api.patch(`/api/v1/admin/locations/${id}/toggle`);
    return res.data;
};
