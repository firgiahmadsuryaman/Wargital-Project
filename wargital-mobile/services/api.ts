import axios from 'axios';
import { Platform } from 'react-native';

// Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator
const API_URL = Platform.select({
    ios: 'http://localhost:3000/api', // Simulator
    android: 'http://192.168.100.10:3000/api', // LAN IP (Use this instead of 10.0.2.2)
    default: 'http://localhost:3000/api',
});

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

import AsyncStorage from '@react-native-async-storage/async-storage';

api.interceptors.request.use(async (request) => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        console.error('Error fetching token', e);
    }
    return request;
});

api.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
});

export default api;
