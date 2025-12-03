// VK Ads Scaler - Bookmarklet Loader
// Этот скрипт загружает интерфейс поверх страницы ads.vk.com

(function() {
  // Конфигурация
  const API_BASE = 'https://vkscaler.ru'; // Твой домен!
  
  // Проверяем что мы на ads.vk.com
  if (!window.location.hostname.includes('ads.vk.com')) {
    alert('❌ Этот букмарклет работает только на ads.vk.com!\n\nОткройте рекламный кабинет ВКонтакте.');
    return;
  }
  
  // Проверяем что интерфейс еще не загружен
  if (document.getElementById('vk-ads-scaler-overlay')) {
    alert('⚠️ Интерфейс уже открыт!');
    return;
  }
  
  // Создаём оверлей
  const overlay = document.createElement('div');
  overlay.id = 'vk-ads-scaler-overlay';
  overlay.innerHTML = `
    <style>
      #vk-ads-scaler-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      #vk-ads-scaler-panel {
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .scaler-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .scaler-header h1 {
        font-size: 24px;
        margin: 0;
      }
      
      .scaler-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
        transition: background 0.2s;
      }
      
      .scaler-close:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .scaler-content {
        padding: 30px;
        overflow-y: auto;
        flex: 1;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
        font-size: 14px;
      }
      
      .form-group input {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box;
      }
      
      .form-group input:focus {
        outline: none;
        border-color: #667eea;
      }
      
      .form-group small {
        display: block;
        margin-top: 5px;
        color: #666;
        font-size: 12px;
      }
      
      .btn-primary {
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
      }
      
      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
      
      .status {
        margin-top: 15px;
        padding: 12px;
        border-radius: 8px;
        font-size: 13px;
        display: none;
      }
      
      .status.success {
        background: #d4edda;
        color: #155724;
      }
      
      .status.error {
        background: #f8d7da;
        color: #721c24;
      }
      
      .logs {
        margin-top: 15px;
        max-height: 200px;
        overflow-y: auto;
        background: #f8f9fa;
        border-radius: 8px;
        padding: 12px;
        font-family: monospace;
        font-size: 11px;
        display: none;
      }
      
      .log-entry {
        padding: 3px 0;
        line-height: 1.4;
      }
      
      .log-entry.success { color: #28a745; }
      .log-entry.error { color: #dc3545; }
      .log-entry.info { color: #17a2b8; }
      
      .progress {
        margin-top: 15px;
        display: none;
      }
      
      .progress-bar {
        width: 100%;
        height: 6px;
        background: #e0e0e0;
        border-radius: 3px;
        overflow: hidden;
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        width: 0%;
        transition: width 0.3s;
      }
      
      .progress-text {
        text-align: center;
        margin-top: 6px;
        font-size: 12px;
        color: #666;
      }
    </style>
    
    <div id="vk-ads-scaler-panel">
      <div class="scaler-header">
        <h1>🚀 Масштабирование</h1>
        <button class="scaler-close" onclick="document.getElementById('vk-ads-scaler-overlay').remove()">×</button>
      </div>
      
      <div class="scaler-content">
        <div class="form-group">
          <label>🔑 API токен:</label>
          <input type="password" id="apiTokenInput" placeholder="Вставьте токен">
          <small>Токен сохраняется в браузере</small>
        </div>
        
        <div class="form-group">
          <label>📋 ID группы:</label>
          <input type="text" id="groupIdInput" placeholder="Например: 124234965">
          <small>ID группы из URL</small>
        </div>
        
        <div class="form-group">
          <label>📊 Количество копий:</label>
          <input type="number" id="copyCountInput" min="1" max="20" value="3">
          <small>От 1 до 20</small>
        </div>
        
        <button class="btn-primary" id="startBtn">🚀 Начать дублирование</button>
        
        <div class="progress" id="progressBar">
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
          </div>
          <div class="progress-text" id="progressText">0 из 0</div>
        </div>
        
        <div class="status" id="statusMsg"></div>
        <div class="logs" id="logsContainer"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Загружаем токен
  const savedToken = localStorage.getItem('vk_ads_scaler_token');
  if (savedToken) {
    document.getElementById('apiTokenInput').value = savedToken;
  }
  
  // Обработчик кнопки
  document.getElementById('startBtn').addEventListener('click', startDuplication);
  
  // Закрытие по ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      overlay.remove();
    }
  });
  
  // Закрытие по клику на фон
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  
  // Функция дублирования
  async function startDuplication() {
    const apiToken = document.getElementById('apiTokenInput').value.trim();
    const groupId = document.getElementById('groupIdInput').value.trim();
    const copyCount = parseInt(document.getElementById('copyCountInput').value);
    
    if (!apiToken || !groupId || !copyCount) {
      showStatus('⚠️ Заполните все поля!', 'error');
      return;
    }
    
    // Сохраняем токен
    localStorage.setItem('vk_ads_scaler_token', apiToken);
    
    const btn = document.getElementById('startBtn');
    const status = document.getElementById('statusMsg');
    const logs = document.getElementById('logsContainer');
    const progress = document.getElementById('progressBar');
    
    btn.disabled = true;
    btn.textContent = '⏳ Дублирование...';
    logs.innerHTML = '';
    logs.style.display = 'block';
    progress.style.display = 'block';
    status.style.display = 'none';
    
    try {
      addLog('🚀 Начинаем дублирование...', 'info');
      updateProgress(0, copyCount);
      
      // Получаем данные группы
      addLog('📥 Получаем данные группы...', 'info');
      
      const fields = 'name,objective,ad_plan_id,package_id,targetings,price,max_price,autobidding_mode,age_restrictions,date_start,date_end,budget_limit,budget_limit_day,banners,utm,enable_utm';
      
      const groupData = await apiRequest('GET', \`ad_groups/\${groupId}.json?fields=\${fields}\`, apiToken);
      
      addLog(\`✅ Группа получена: \${groupData.name}\`, 'success');
      
      // Создаём копии
      let successCount = 0;
      
      for (let i = 1; i <= copyCount; i++) {
        addLog(\`\\n📋 Копия \${i}/\${copyCount}...\`, 'info');
        
        try {
          const newGroupData = { ...groupData };
          newGroupData.name = \`\${groupData.name} (копия \${i})\`;
          
          // Удаляем read-only поля
          delete newGroupData.id;
          delete newGroupData.status;
          delete newGroupData.created;
          delete newGroupData.updated;
          delete newGroupData.delivery;
          delete newGroupData.issues;
          
          // Получаем баннеры
          const bannerIds = groupData.banners || [];
          const bannersData = [];
          
          if (bannerIds.length > 0) {
            for (const bannerId of bannerIds) {
              const banner = await apiRequest('GET', \`banners/\${bannerId}.json?fields=id,name,content,textblocks,urls\`, apiToken);
              
              const bannerForCreate = {
                name: \`\${banner.name || 'Баннер'} (копия \${i})\`
              };
              
              if (banner.content) {
                bannerForCreate.content = {};
                for (const [key, value] of Object.entries(banner.content)) {
                  if (value && value.id) {
                    bannerForCreate.content[key] = { id: value.id };
                  }
                }
              }
              
              if (banner.urls) {
                bannerForCreate.urls = {};
                for (const [key, value] of Object.entries(banner.urls)) {
                  if (value && value.id) {
                    bannerForCreate.urls[key] = { id: value.id };
                  }
                }
              }
              
              if (banner.textblocks) {
                bannerForCreate.textblocks = banner.textblocks;
              }
              
              bannersData.push(bannerForCreate);
              await sleep(1000);
            }
          }
          
          if (bannersData.length > 0) {
            newGroupData.banners = bannersData;
          }
          
          // Создаём группу
          const result = await apiRequest('POST', 'ad_groups.json', apiToken, newGroupData);
          
          addLog(\`  ✅ Создано! ID=\${result.id}\`, 'success');
          successCount++;
          updateProgress(successCount, copyCount);
          
          if (i < copyCount) {
            await sleep(5000);
          }
          
        } catch (error) {
          addLog(\`  ❌ Ошибка: \${error.message}\`, 'error');
        }
      }
      
      addLog(\`\\n🏁 Готово: \${successCount}/\${copyCount}\`, 'success');
      showStatus(\`✅ Создано \${successCount} копий!\`, 'success');
      
    } catch (error) {
      addLog(\`❌ Ошибка: \${error.message}\`, 'error');
      showStatus(\`❌ Ошибка: \${error.message}\`, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '🚀 Начать дублирование';
    }
  }
  
  // API запрос через прокси
  async function apiRequest(method, endpoint, token, body = null) {
    const url = \`\${API_BASE}/api/vk/\${endpoint}\`;
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : null
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(\`\${response.status}: \${error}\`);
    }
    
    return await response.json();
  }
  
  function addLog(message, type = 'info') {
    const logs = document.getElementById('logsContainer');
    const entry = document.createElement('div');
    entry.className = \`log-entry \${type}\`;
    entry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
    logs.appendChild(entry);
    logs.scrollTop = logs.scrollHeight;
  }
  
  function showStatus(message, type) {
    const status = document.getElementById('statusMsg');
    status.style.display = 'block';
    status.className = \`status \${type}\`;
    status.textContent = message;
  }
  
  function updateProgress(current, total) {
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    const percent = (current / total) * 100;
    fill.style.width = \`\${percent}%\`;
    text.textContent = \`\${current} из \${total}\`;
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
})();
