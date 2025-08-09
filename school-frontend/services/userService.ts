import api from '@/lib/api';
import { User, ApiResponse } from '@/types/api';
import axios from 'axios';

export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await api.get('/users');
    return { data: response.data, success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.message, success: false };
    }
    return { error: 'An unexpected error occurred', success: false };
  }
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post('/users', userData);
    return { data: response.data, success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.message, success: false };
    }
    return { error: 'An unexpected error occurred', success: false };
  }
};