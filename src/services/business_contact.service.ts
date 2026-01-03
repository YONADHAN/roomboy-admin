import api from '@/api/axios';

export interface IPhoneNumber {
  label: string;
  number: string;
  isPrimary: boolean;
}

export interface ISocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'whatsapp';
  url: string;
}

export interface IBusinessContact {
  _id: string;
  contactId: string;
  displayName: string;
  description?: string;
  phoneNumbers: IPhoneNumber[];
  email?: string;
  socialLinks?: ISocialLink[];
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBusinessContactCreate {
  displayName: string;
  description?: string;
  phoneNumbers: IPhoneNumber[];
  email?: string;
  socialLinks?: ISocialLink[];
  website?: string;
  isActive?: boolean;
}

export interface IBusinessContactResponse {
  data: IBusinessContact[];
  currentPage: number;
  totalPages: number;
}

export const getContacts = async (params: { page?: number; limit?: number; search?: string } = {}): Promise<IBusinessContactResponse> => {
  const res = await api.get('/api/v1/admin/business-contacts', { params });
  return res.data;
};

export const getContactById = async (id: string): Promise<IBusinessContact> => {
  const res = await api.get(`/api/v1/admin/business-contacts/${id}`);
  return res.data;
};

export const createContact = async (data: IBusinessContactCreate): Promise<IBusinessContact> => {
  const res = await api.post('/api/v1/admin/business-contacts', data);
  return res.data;
};

export const updateContact = async (id: string, data: Partial<IBusinessContactCreate>): Promise<IBusinessContact> => {
  const res = await api.put(`/api/v1/admin/business-contacts/${id}`, data);
  return res.data;
};

export const toggleContactStatus = async (id: string): Promise<IBusinessContact> => {
  const res = await api.patch(`/api/v1/admin/business-contacts/${id}/toggle`);
  return res.data;
};

export const deleteContact = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/admin/business-contacts/${id}`);
};
