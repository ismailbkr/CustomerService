const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nrvlgvqm6i.execute-api.us-east-1.amazonaws.com/prod';

export interface RegisterData {
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    email: string;
}

export interface AuthResponse {
    message: string;
    email?: string;
}

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

export async function register(data: RegisterData): Promise<AuthResponse> {
    try {
        console.log('Register isteği başlatılıyor...');
        console.log('API URL:', API_URL);
        console.log('Gönderilen veri:', data);

        const requestBody = JSON.stringify({
            email: data.email,
            password: data.password
        });
        console.log('Request body:', requestBody);

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers,
            body: requestBody,
            mode: 'cors'
        });

        console.log('HTTP Status:', response.status);
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let responseData;
        try {
            responseData = JSON.parse(responseText);
            console.log('Parsed response data:', responseData);

            // API Gateway'den gelen yanıtı işle
            if (responseData.body) {
                const innerResponse = typeof responseData.body === 'string'
                    ? JSON.parse(responseData.body)
                    : responseData.body;

                console.log('Inner response:', innerResponse);

                // HTTP 200 olmasa bile, mesajı doğru şekilde işle
                if (responseData.statusCode >= 400) {
                    throw new Error(innerResponse.message || 'Bir hata oluştu');
                }

                return innerResponse;
            }

            return responseData;
        } catch (parseError) {
            console.error('Parse error:', parseError);
            throw new Error(parseError instanceof Error ? parseError.message : 'Sunucu yanıtı işlenemedi');
        }
    } catch (error: unknown) {
        console.error('Register error:', error);
        throw error;
    }
}

export async function login(data: LoginData): Promise<AuthResponse> {
    try {
        console.log('Login isteği başlatılıyor...');
        console.log('API URL:', API_URL);
        console.log('Gönderilen veri:', { email: data.email, passwordLength: data.password.length });

        const requestBody = JSON.stringify({
            email: data.email,
            password: data.password
        });
        console.log('Request body:', requestBody);

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers,
            body: requestBody,
            mode: 'cors'
        });

        console.log('HTTP Status:', response.status);
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let responseData;
        try {
            responseData = JSON.parse(responseText);
            console.log('Parsed response data:', responseData);

            // API Gateway'den gelen yanıtı düzelt
            if (responseData.body && typeof responseData.body === 'string') {
                const innerResponse = JSON.parse(responseData.body);
                return innerResponse;
            }
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Sunucu yanıtı işlenemedi');
        }

        if (!response.ok) {
            console.error('Login hatası:', responseData);
            const errorMessage = responseData.message || 'Giriş işlemi başarısız oldu.';
            throw new Error(errorMessage);
        }

        return responseData;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Login error:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        } else {
            console.error('Unknown login error:', error);
        }
        throw error;
    }
} 