"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CreditCard, Save, Loader2, Wallet, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';

export default function AddPaymentPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('BANK_TRANSFER');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network
            alert('Metode pembayaran berhasil ditambahkan (Simulasi)');
            router.push('/profile/payment');
        } catch (error) {
            console.error(error);
            alert('Gagal menambahkan metode pembayaran');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 bg-gray-50/50 min-h-screen">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="ghost" asChild className="gap-2 pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary">
                        <Link href="/profile/payment">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold md:hidden">Tambah Metode</h1>
                </div>

                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900">Tambah Metode Pembayaran</h1>
                    <p className="text-muted-foreground mt-1">Tambahkan rekening bank atau e-wallet baru.</p>
                </div>
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                    <form onSubmit={onSubmit}>
                        <CardContent className="space-y-6 pt-6">

                            <div className="space-y-2">
                                <Label>Jenis Pembayaran</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${type === 'BANK_TRANSFER' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:border-gray-200 bg-gray-50'}`}
                                        onClick={() => setType('BANK_TRANSFER')}
                                    >
                                        <Building2 className="h-6 w-6" />
                                        <span className="font-medium text-sm">Transfer Bank</span>
                                    </div>
                                    <div
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${type === 'E_WALLET' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:border-gray-200 bg-gray-50'}`}
                                        onClick={() => setType('E_WALLET')}
                                    >
                                        <Wallet className="h-6 w-6" />
                                        <span className="font-medium text-sm">E-Wallet</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="provider">Nama Bank / E-Wallet</Label>
                                <Select defaultValue="BCA">
                                    <SelectTrigger className="border-gray-200">
                                        <SelectValue placeholder="Pilih Provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {type === 'BANK_TRANSFER' ? (
                                            <>
                                                <SelectItem value="BCA">BCA</SelectItem>
                                                <SelectItem value="MANDIRI">Mandiri</SelectItem>
                                                <SelectItem value="BRI">BRI</SelectItem>
                                                <SelectItem value="BNI">BNI</SelectItem>
                                            </>
                                        ) : (
                                            <>
                                                <SelectItem value="GOPAY">GoPay</SelectItem>
                                                <SelectItem value="OVO">OVO</SelectItem>
                                                <SelectItem value="DANA">DANA</SelectItem>
                                                <SelectItem value="SHOPEEPAY">ShopeePay</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountNumber">Nomor Rekening / HP</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="accountNumber" placeholder="1234xxxxxx" className="pl-9 border-gray-200" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountName">Nama Pemilik Akun</Label>
                                <Input id="accountName" placeholder="Nama sesuai di buku tabungan/aplikasi" className="border-gray-200" required />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <Label htmlFor="isPrimary" className="cursor-pointer">Jadikan Utama</Label>
                                <Switch id="isPrimary" />
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end pt-4 pb-8 px-6">
                            <Button type="submit" disabled={isLoading} className="w-full md:w-auto min-w-[150px] shadow-lg shadow-primary/20">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan Metode
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