// API Proxy для VK Ads API
// Vercel Serverless Function

const axios = require('axios');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Извлекаем путь API
    const apiPath = req.url.replace('/api/vk/', '');
    const vkUrl = `https://ads.vk.com/api/v2/${apiPath}`;
    
    console.log(`Proxy: ${req.method} ${vkUrl}`);
    
    // Проверяем авторизацию
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header required' });
    }
    
    // Проксируем запрос к VK API
    const response = await axios({
      method: req.method,
      url: vkUrl,
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      },
      data: req.body,
      timeout: 30000
    });
    
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      res.status(504).json({ error: 'Request timeout' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
