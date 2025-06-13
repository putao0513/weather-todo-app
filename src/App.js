import React, { useState, useEffect } from 'react';
import { pinyin } from 'pinyin-pro'; // 使用支持去声调的库

const WEATHER_API_KEY = '7b79783eaa789574bdc8f5299116acae'; // ← 使用你自己的 key！

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState('');

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [taskInput, setTaskInput] = useState('');

  const fetchWeather = () => {
    if (!city.trim()) return;

    let cityToSearch = city.trim();
    const isChinese = /[\u4e00-\u9fa5]/.test(cityToSearch);

    console.log('💡 原始输入：', cityToSearch);
    console.log('🔍 是否为中文：', isChinese);

    if (isChinese) {
      // 转为无声调拼音
      cityToSearch = pinyin(cityToSearch, { toneType: 'none', type: 'array' }).join('');
      console.log('✅ 转换为拼音：', cityToSearch);
    }

    const query = `${cityToSearch},cn`;
    const finalUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${WEATHER_API_KEY}&units=metric`;

    console.log('🌐 最终请求 URL：', finalUrl);

    setWeatherError('');
    fetch(finalUrl)
      .then(res => {
        if (!res.ok) throw new Error('城市不存在或拼写错误，请检查拼音是否正确。');
        return res.json();
      })
      .then(data => {
        console.log('✅ 天气数据获取成功：', data);
        setWeather(data);
      })
      .catch(err => {
        console.error('❌ 请求失败：', err);
        setWeather(null);
        setWeatherError(err.message);
      });
  };

  const addTask = () => {
    if (!taskInput.trim()) return;
    const newTasks = [...tasks, { id: Date.now(), text: taskInput.trim() }];
    setTasks(newTasks);
    setTaskInput('');
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>天气查询 + 任务列表</h1>

      <div style={{ marginBottom: 30 }}>
        <h2>天气查询</h2>
        <input
          type="text"
          value={city}
          placeholder="输入城市名（支持中文）"
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather} style={{ marginLeft: 10 }}>查询天气</button>
        <p style={{ fontSize: 12, color: '#888', marginTop: 5 }}>
          提示：支持中文城市名，会自动转换成拼音查询
        </p>

        {weatherError && (
          <p style={{ color: 'red', marginTop: 10 }}>{weatherError}</p>
        )}

        {weather && (
          <div style={{ marginTop: 10 }}>
            <p>🌆 城市：{weather.name}</p>
            <p>🌡️ 温度：{weather.main.temp} °C</p>
            <p>☁️ 天气：{weather.weather[0].description}</p>
            <p>💧 湿度：{weather.main.humidity} %</p>
            <p>🌬️ 风速：{weather.wind.speed} m/s</p>
          </div>
        )}
      </div>

      <div>
        <h2>任务列表</h2>
        <input
          type="text"
          value={taskInput}
          placeholder="输入新任务"
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask} style={{ marginLeft: 10 }}>添加任务</button>

        <ul>
          {tasks.map(task => (
            <li key={task.id} style={{ margin: '8px 0' }}>
              {task.text}
              <button
                onClick={() => deleteTask(task.id)}
                style={{ marginLeft: 10, color: 'red' }}
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
