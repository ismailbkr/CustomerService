'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatComponent from '../../components/ChatComponent';
import Link from 'next/link';

export default function ChatPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/');
        } else {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
                <p className="text-gray-600 mb-4">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
                <Link href="/" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500">
                    Ana Sayfaya Dön
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        Müşteri Hizmetleri
                    </h1>
                    <Link
                        href="/"
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        Ana Sayfa
                    </Link>
                </div>
                <ChatComponent />
            </div>
        </div>
    );
} 