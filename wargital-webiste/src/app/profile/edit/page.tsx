"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, Save, Loader2, User, Phone, Mail, Camera } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarImage } from '@/lib/images';

export default function EditProfilePage() {
    const { user, isUserLoading, refreshUser } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        } else if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
            });
        }
    }, [user, isUserLoading, router]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Dummy logic to simulate API call for frontend-first development
        try {
            // Uncomment this when backend is fully ready and tested
            // await apiClient.put('/user/profile', formData);
            // await refreshUser(); 

            // Simulating network request
            await new Promise(resolve => setTimeout(resolve, 800));

            alert('Profil berhasil diperbarui (Simulasi)');
            // router.push('/profile');
        } catch (error: any) {
            console.error(error);
            alert('Gagal memperbarui profil');
        } finally {
            setIsLoading(false);
        }
    };

    if (isUserLoading || !user) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const getInitials = (email: string) => {
        return email.charAt(0).toUpperCase();
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 bg-gray-50/50 min-h-screen">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex items-center justify-between">
                    <Button variant="ghost" asChild className="gap-2 pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary">
                        <Link href="/profile">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Profil
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold md:hidden">Edit Profil</h1>
                </div>

                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5 w-full relative">
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                            <div className="relative group cursor-pointer">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                    <AvatarImage src={getAvatarImage('default-avatar.jpg')} alt={user.email} />
                                    <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                        {getInitials(user.email)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 bg-white text-primary p-1.5 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <Camera className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-6 px-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">{user.email}</h2>
                        <p className="text-sm text-muted-foreground mt-1">Perbarui informasi pribadi Anda</p>
                    </div>

                    <form onSubmit={onSubmit}>
                        <CardContent className="space-y-6 px-8 pb-8">

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={user.email}
                                        disabled
                                        className="pl-9 bg-gray-50/50 border-gray-200 text-muted-foreground opacity-100 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground ml-1">*Email tidak dapat diubah</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nama Lengkap</Label>
                                <div className="relative group focus-within:ring-2 focus-within:ring-primary/20 rounded-md transition-all">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Budi Santoso"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="pl-9 border-gray-200 focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Nomor Telepon</Label>
                                <div className="relative group focus-within:ring-2 focus-within:ring-primary/20 rounded-md transition-all">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="phone"
                                        placeholder="08xxxxxxxxxx"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        type="tel"
                                        className="pl-9 border-gray-200 focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-between items-center px-8 pb-8 pt-2 bg-gray-50/30 border-t border-gray-100 gap-4">
                            <Button variant="outline" type="button" onClick={() => router.back()} className="w-1/3 hover:bg-gray-100 hover:text-gray-900 border-gray-200 transition-colors">
                                Batal
                            </Button>
                            <Button type="submit" disabled={isLoading} className="w-2/3 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}