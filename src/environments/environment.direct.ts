export const environment = {
    production: false,
    // Прямое подключение к API - определяет URL на основе текущего хоста
    apiUrl: getApiUrl(),
    database: {
        host: 'localhost',
        port: 5432,
        name: 'admin_panel_db',
        user: 'postgres',
        password: 'postgres'
    }
};

function getApiUrl(): string {
    // Если мы находимся в браузере
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // Если это localhost, используем localhost
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        }
        
        // Для всех остальных случаев используем текущий хост
        return `http://${hostname}:3000/api`;
    }
    
    // Fallback для серверной стороны
    return 'http://localhost:3000/api';
} 