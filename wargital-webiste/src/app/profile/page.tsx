'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import { getAvatarImage } from '@/lib/images';

export default function ProfilePage() {
    const { user, isUserLoading, logout } = useAuth();
    const router = useRouter();

    // Redirect if not logged in
    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    const getInitials = (email: string) => {
        return email.charAt(0).toUpperCase();
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="text-3xl font-bold font-headline mb-8 text-center md:text-left">Profil Saya</h1>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                        <Avatar className="h-16 w-16 md:h-20 md:w-20">
                            <AvatarImage src={getAvatarImage('default-avatar.jpg')} alt={user.email} />
                            <AvatarFallback className="text-lg">{getInitials(user.email)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <CardTitle className="text-xl md:text-2xl">{user.email}</CardTitle>
                            <CardDescription>Halo, senang bertemu kembali!</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="mt-6 space-y-4">
                        <div className="grid gap-1">
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p className="text-base">{user.email}</p>
                        </div>
                        {/* Add more profile fields here if available in the future */}
                    </CardContent>
                    <CardFooter className="flex justify-end pt-6">
                        <Button variant="destructive" onClick={logout} className="gap-2">
                            <LogOut className="h-4 w-4" />
                            Keluar
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
