import { apiClient } from './api';

export interface CreateContactDto {
  topic: string;
  email: string;
  name: string;
  message: string;
}

export const submitContactForm = async (data: CreateContactDto) => {
  const response = await apiClient<any>('POST', '/contact', data);
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to submit form');
  }
  return response.data;
};
