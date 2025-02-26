import { useState } from 'react';
import { login, register } from '@/services/auth';

interface AuthFormProps {
    onSuccess: (email: string) => void;
}

export function LoginForm({ onSuccess }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Login isteği gönderiliyor:', { email });
            const response = await login({ email, password });
            console.log('Login cevabı:', response);
            if (response.email) {
                onSuccess(response.email);
            }
        } catch (err) {
            console.error('Login hatası:', err);
            setError(err instanceof Error ? err.message : 'Giriş işlemi başarısız oldu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Şifre
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
        </form>
    );
}

export function RegisterForm({ onSuccess }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 8) {
            setError('Şifre en az 8 karakter olmalıdır.');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Kayıt isteği gönderiliyor:', { email });
            console.log('API isteği URL:', process.env.NEXT_PUBLIC_API_URL);
            const response = await register({ email, password });
            console.log('Kayıt cevabı:', response);

            setSuccess(response.message);
            if (response.email) {
                onSuccess(response.email);
            }
        } catch (err) {
            console.error('Kayıt hatası:', err);
            setError(err instanceof Error ? err.message : 'Kayıt işlemi başarısız oldu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )}
            {success && (
                <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">{success}</h3>
                        </div>
                    </div>
                </div>
            )}
            <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-300">
                    Email
                </label>
                <input
                    type="email"
                    id="register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                    required
                />
            </div>
            <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-300">
                    Şifre
                </label>
                <input
                    type="password"
                    id="register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                    required
                    minLength={8}
                    placeholder="En az 8 karakter"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
        </form>
    );
} 