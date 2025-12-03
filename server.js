const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - разрешаем все источники
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Статические файлы
app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Прокси для VK Ads API
app.all('/api/vk/*', async (req, res) => {
  try {
    const vkPath = req.params[0];
    const vkUrl = `https://ads.vk.com/api/v2/${vkPath}`;
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${vkUrl}`);
    
    // Проверяем авторизацию
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header required' });
    }
    
    const response = await axios({
      method: req.method,
      url: vkUrl,
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      },
      data: req.body,
      params: req.query,
      timeout: 30000 // 30 секунд таймаут
    });
    
    res.json(response.data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    
    if (error.response) {
      // Ошибка от VK API
      res.status(error.response.status).json(error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      // Таймаут
      res.status(504).json({ error: 'Request timeout' });
    } else {
      // Другие ошибки
      res.status(500).json({ error: error.message });
    }
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 VK Ads Scaler API running on port ${PORT}`);
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/api/vk/*`);
});
