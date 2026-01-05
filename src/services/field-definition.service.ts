import api from '@/api/axios'

export interface IFieldDefinition {
    _id: string
    entityType: 'property' | 'product' | 'service'
    fieldKey: string
    label: string
    dataType: 'string' | 'number' | 'boolean' | 'select' | 'multi-select'
    required: boolean
    options?: string[]
    rules?: {
        min?: number
        max?: number
        regex?: string
    }
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface IFieldDefinitionResponse {
    data: IFieldDefinition[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface ICreateFieldDefinitionDTO {
    entityType: 'property' | 'product' | 'service'
    fieldKey: string
    label: string
    dataType: 'string' | 'number' | 'boolean' | 'select' | 'multi-select'
    required?: boolean
    options?: string[]
    rules?: {
        min?: number
        max?: number
        regex?: string
    }
}

export interface IUpdateFieldDefinitionDTO {
    label?: string
    dataType?: 'string' | 'number' | 'boolean' | 'select' | 'multi-select'
    required?: boolean
    options?: string[]
    rules?: {
        min?: number
        max?: number
        regex?: string
    }
}

export const getFieldDefinitions = async (params: {
    page?: number
    limit?: number
    entityType?: string
    isActive?: boolean
} = {}): Promise<IFieldDefinitionResponse> => {
    const res = await api.get('/api/v1/admin/field-definitions', { params })
    return res.data
}

export const getFieldDefinitionById = async (id: string): Promise<IFieldDefinition> => {
    const res = await api.get(`/api/v1/admin/field-definitions/${id}`)
    return res.data
}

export const createFieldDefinition = async (
    data: ICreateFieldDefinitionDTO
): Promise<IFieldDefinition> => {
    const res = await api.post('/api/v1/admin/field-definitions', data)
    return res.data
}

export const updateFieldDefinition = async (
    id: string,
    data: IUpdateFieldDefinitionDTO
): Promise<IFieldDefinition> => {
    const res = await api.put(`/api/v1/admin/field-definitions/${id}`, data)
    return res.data
}

export const toggleFieldDefinitionStatus = async (id: string): Promise<IFieldDefinition> => {
    const res = await api.patch(`/api/v1/admin/field-definitions/${id}/toggle`)
    return res.data
}

export const deleteFieldDefinition = async (id: string): Promise<void> => {
    await api.delete(`/api/v1/admin/field-definitions/${id}`)
}
