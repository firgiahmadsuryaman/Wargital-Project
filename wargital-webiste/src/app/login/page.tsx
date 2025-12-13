
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const formSchema = z.object({
  email: z.string().email({
    message: 'Harap masukkan alamat email yang valid.',
  }),
  password: z.string().min(1, {
    message: 'Kata sandi tidak boleh kosong.',
  }),
});

export default function LoginPage() {
  const { toast } = useToast();
  const { user, isUserLoading, login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/profile');
    }
  }, [user, isUserLoading, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      toast({
        title: 'Masuk Berhasil',
        description: 'Selamat datang kembali!',
      });
      router.push('/');
    } catch (error: unknown) {
      const description = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Terjadi kesalahan saat masuk. Silakan coba lagi.";
      toast({
        variant: 'destructive',
        title: 'Gagal Masuk',
        description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  
}
