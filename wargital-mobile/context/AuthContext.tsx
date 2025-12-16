import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import api from '@/services/api';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (token: string, user: User) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    signIn: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const userData = await AsyncStorage.getItem('user');

                if (token && userData) {
                    // Set default header for future requests
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setUser(JSON.parse(userData));
                }
            } catch (e) {
                console.error('Failed to load auth state', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const signIn = async (token: string, newUser: User) => {
        try {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(newUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(newUser);
        } catch (e) {
            console.error(e);
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
            // Optional: Navigation handled by protected route logic or manually here
            router.replace('/auth/login');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
