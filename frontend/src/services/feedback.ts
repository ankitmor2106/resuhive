import { apiClient } from './api';

export interface CreateFeedbackDto {
  rating: number;
  feedback?: string;
}

export const submitUserFeedback = async (data: CreateFeedbackDto) => {
  const response = await apiClient<any>('POST', '/feedback', data);
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to submit feedback');
  }
  return response.data;
};
