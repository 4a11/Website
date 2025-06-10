const axios = require('axios').default;

async function testRemoteConnection() {
    console.log('🌐 Тестирование удаленного подключения к серверу...\n');
    
    const endpoints = [
        'http://novadom.duckdns.org:3000',
        'http://novadom.duckdns.org:3000/api/auth/login',
        'http://212.220.204.230:3000',
        'http://212.220.204.230:3000/api/auth/login'
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`📡 Тестирование: ${endpoint}`);
            
            if (endpoint.includes('/api/auth/login')) {
                // Тест авторизации
                const response = await axios.post(endpoint, {
                    username: 'admin',
                    password: 'password123'
                }, {
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'TestScript/1.0'
                    }
                });
                
                console.log(`✅ Статус: ${response.status}`);
                console.log(`   Токен получен: ${response.data.token ? 'Да' : 'Нет'}`);
                console.log(`   Роль: ${response.data.role || 'Неизвестно'}`);
                
            } else {
                // Тест доступности
                const response = await axios.get(endpoint, {
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'TestScript/1.0'
                    }
                });
                
                console.log(`✅ Статус: ${response.status}`);
                console.log(`   Размер ответа: ${response.data.length || 'Неизвестно'} байт`);
            }
            
        } catch (error) {
            console.log(`❌ Ошибка: ${error.message}`);
            if (error.response) {
                console.log(`   HTTP статус: ${error.response.status}`);
                console.log(`   Данные ошибки: ${JSON.stringify(error.response.data)}`);
            }
            if (error.code) {
                console.log(`   Код ошибки: ${error.code}`);
            }
        }
        
        console.log(''); // Пустая строка для разделения
    }
    
    // Тест прямого подключения к локальному серверу
    console.log('🏠 Тестирование локального сервера...');
    try {
        const localResponse = await axios.post('http://localhost:3000/api/auth/login', {
            username: 'admin', 
            password: 'password123'
        }, {
            timeout: 5000
        });
        
        console.log('✅ Локальный сервер работает!');
        console.log(`   Статус: ${localResponse.status}`);
        console.log(`   Токен: ${localResponse.data.token ? 'Получен' : 'Не получен'}`);
        
    } catch (localError) {
        console.log('❌ Локальный сервер недоступен!');
        console.log(`   Ошибка: ${localError.message}`);
    }
}

testRemoteConnection().catch(console.error); 