export const environment = {
    production: false,
    // Конфигурация для внешнего доступа
    apiUrl: 'http://212.220.204.230:3000/api',
    externalAccess: true,
    database: {
        host: 'localhost',
        port: 5432,
        name: 'admin_panel_db',
        user: 'postgres',
        password: 'postgres'
    }
}; 