import api from './api';
import { Address } from '@/types';

export const addressService = {
    getAddresses: async (): Promise<Address[]> => {
        const response = await api.get('/user/addresses');
        return response.data;
    },

    createAddress: async (data: Partial<Address>): Promise<Address> => {
        const response = await api.post('/user/addresses', data);
        return response.data;
    },

    updateAddress: async (id: string, data: Partial<Address>): Promise<Address> => {
        const response = await api.put(`/user/addresses/${id}`, data);
        return response.data;
    },

    deleteAddress: async (id: string): Promise<void> => {
        await api.delete(`/user/addresses/${id}`);
    }
};
