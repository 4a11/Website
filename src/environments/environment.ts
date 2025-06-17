export const environment = {
    production: false,
    // Динамическое определение API URL на основе текущего хоста
    // Работает и для localhost, и для сетевых подключений
    apiUrl: getApiUrl(),
    database: {
        host: 'localhost',
        port: 5432,
        name: 'postgres',
        user: 'postgres',
        password: 'NiceDbPassword'
    }
};

function getApiUrl(): string {
    // Если мы находимся в браузере
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // Если это localhost, используем localhost
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return '/api'; // Используем прокси для localhost
        }
        
        // Для всех остальных случаев используем прямое подключение
        return `http://${hostname}:3000/api`;
    }
    
    // Fallback для серверной стороны
    return '/api';
} 