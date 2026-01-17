'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Shield, MapPin, CreditCard, ChevronRight, Settings } from 'lucide-react';
import { getAvatarImage } from '@/lib/images';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const { user, isUserLoading, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('account');

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
        return null;
    }

    const getInitials = (email: string) => {
        return email.charAt(0).toUpperCase();
    };

    const MenuItem = ({ icon: Icon, label, href, color, onClick }: any) => (
        <div className="group relative">
            {href ? (
                <Link
                    href={href}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                    <div className="flex items-center gap-4">
                        <div className={cn("p-2.5 rounded-full bg-background border border-border group-hover:border-primary/20", color)}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium group-hover:text-primary transition-colors">{label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </Link>
            ) : (
                <button
                    onClick={onClick}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-destructive/5 hover:border-destructive/30 transition-all duration-300 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-full bg-background border border-border group-hover:border-destructive/20 text-destructive">
                            <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-destructive">{label}</span>
                    </div>
                </button>
            )}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">

                {/* Left Sidebar - Profile Summary */}
                <div className="lg:w-1/3">
                    <Card className="h-full border-none shadow-lg bg-gradient-to-br from-card to-accent/10">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto mb-4 relative group cursor-pointer">
                                <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-background shadow-xl ring-2 ring-primary/20 transition-transform group-hover:scale-105">
                                    <AvatarImage src={getAvatarImage('default-avatar.jpg')} alt={user.email} />
                                    <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                                        {getInitials(user.email)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-2 border-background">
                                    <Settings className="h-4 w-4" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold mt-4">{user.name || 'Warga Digital'}</CardTitle>
                            <CardDescription className="text-sm font-medium bg-secondary/50 py-1 px-3 rounded-full inline-block mt-2">
                                {user.email}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center pt-2">
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="p-4 rounded-2xl bg-background shadow-sm border border-border/50">
                                    <p className="text-2xl font-bold text-primary">0</p>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Pesanan</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-background shadow-sm border border-border/50">
                                    <p className="text-2xl font-bold text-primary">0</p>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Voucher</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Content - Menu Grid */}
                <div className="lg:w-2/3 space-y-8">

                    {/* Account & Security Section */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Akun & Keamanan
                        </h2>
                        <div className="grid gap-4">
                            <MenuItem
                                icon={User}
                                label="Edit Profil"
                                href="/profile/edit"
                                color="text-blue-500"
                            />
                            <MenuItem
                                icon={MapPin}
                                label="Alamat Tersimpan"
                                href="/profile/address"
                                color="text-emerald-500"
                            />
                            <MenuItem
                                icon={CreditCard}
                                label="Metode Pembayaran"
                                href="/profile/payment"
                                color="text-purple-500"
                            />
                        </div>
                    </div>

                    {/* Preferences & Logout */}
                    <div className="pt-4 border-t border-dashed">
                        <MenuItem
                            icon={LogOut}
                            label="Keluar"
                            onClick={logout}
                            color="text-red-500"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
