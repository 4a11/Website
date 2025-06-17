export const environment = {
  production: true,
  // Динамическое определение API URL для продакшен сборки
  apiUrl: getApiUrl()
};

function getApiUrl(): string {
  // Если мы находимся в браузере
  if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port;
      
      console.log('Production API URL detection:', { hostname, port });
      
      // Если это localhost, используем localhost
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return port ? `http://${hostname}:${port}/api` : `http://${hostname}/api`;
      }
      
      // Для всех остальных случаев используем текущий хост с портом 3000
      return `http://${hostname}:3000/api`;
  }
  
  // Fallback для серверной стороны
  return '/api';
} 