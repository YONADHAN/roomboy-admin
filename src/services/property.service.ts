import api from '@/api/axios'

export interface IProperty {
    _id: string
    propertyId: string
    title: string
    entityType: 'property'
    attributes: Record<string, any>
    location?: {
        city?: string
        locality?: string
        latitude?: number
        longitude?: number
    }
    images: string[]
    status: 'active' | 'blocked' | 'pending'
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

export interface IPropertyResponse {
    data: IProperty[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface ICreatePropertyDTO {
    title: string
    attributes?: Record<string, any>
    location?: {
        city?: string
        locality?: string
        latitude?: number
        longitude?: number
    }
    images?: string[]
    status?: 'active' | 'blocked' | 'pending'
}

export interface IUpdatePropertyDTO {
    title?: string
    attributes?: Record<string, any>
    location?: {
        city?: string
        locality?: string
        latitude?: number
        longitude?: number
    }
    images?: string[]
    status?: 'active' | 'blocked' | 'pending'
}

export const getProperties = async (params: {
    page?: number
    limit?: number
    status?: string
    city?: string
    search?: string
} = {}): Promise<IPropertyResponse> => {
    const res = await api.get('/api/v1/admin/properties', { params })
    return res.data
}

export const getPropertyById = async (id: string): Promise<IProperty> => {
    const res = await api.get(`/api/v1/admin/properties/${id}`)
    return res.data
}

export const createProperty = async (data: ICreatePropertyDTO): Promise<IProperty> => {
    const res = await api.post('/api/v1/admin/properties', data)
    return res.data
}

export const updateProperty = async (id: string, data: IUpdatePropertyDTO): Promise<IProperty> => {
    const res = await api.put(`/api/v1/admin/properties/${id}`, data)
    return res.data
}

export const updatePropertyStatus = async (
    id: string,
    status: 'active' | 'blocked' | 'pending'
): Promise<IProperty> => {
    const res = await api.patch(`/api/v1/admin/properties/${id}/status`, { status })
    return res.data
}

export const deleteProperty = async (id: string): Promise<void> => {
    await api.delete(`/api/v1/admin/properties/${id}`)
}
