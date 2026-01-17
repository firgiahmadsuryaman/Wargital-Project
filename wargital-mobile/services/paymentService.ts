import api from './api';
import { PaymentMethod } from '@/types';

export const paymentService = {
    // Ambil daftar metode pembayaran
    getPaymentMethods: async (): Promise<PaymentMethod[]> => {
        const response = await api.get<PaymentMethod[]>('/user/payment-methods');
        return response.data;
    },

    // Tambah metode pembayaran
    addPaymentMethod: async (data: {
        type: string;
        provider: string;
        accountNumber: string;
        accountName: string;
        isPrimary?: boolean;
    }): Promise<PaymentMethod> => {
        const response = await api.post<PaymentMethod>('/user/payment-methods', data);
        return response.data;
    },

    // Hapus metode pembayaran
    deletePaymentMethod: async (id: string): Promise<void> => {
        await api.delete(`/user/payment-methods/${id}`);
    }
};
