"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

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

        try {
            await apiClient.put('/user/profile', formData);
            await refreshUser(); // Update context
            toast.success('Profil berhasil diperbarui');
            router.push('/profile');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
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

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <Button variant="ghost" asChild className="gap-2 pl-0 hover:pl-2 transition-all">
                        <Link href="/profile">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Profil
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Profil</CardTitle>
                        <CardDescription>
                            Perbarui informasi pribadi Anda di sini.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={onSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={user.email}
                                    disabled
                                    className="bg-muted text-muted-foreground opacity-100"
                                />
                                <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    placeholder="Masukkan nama lengkap Anda"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Nomor Telepon</Label>
                                <Input
                                    id="phone"
                                    placeholder="08xxxxxxxxxx"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    type="tel"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-4">
                            <Button type="submit" disabled={isLoading} className="min-w-[120px] gap-2">
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Simpan
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}