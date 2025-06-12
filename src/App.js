import React, { useState, useEffect } from 'react';

const WEATHER_API_KEY = '7b79783eaa789574bdc8f5299116acae'; // ←←← 这里一定记得替换成你从 OpenWeatherMap 拿到的 API Key！

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
    if (!city) return;
    setWeatherError('');
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`)
      .then(res => {
        if (!res.ok) throw new Error('城市不存在或拼写错误');
        return res.json();
      })
      .then(data => setWeather(data))
      .catch(err => {
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
          placeholder="输入城市名"
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather} style={{ marginLeft: 10 }}>查询天气</button>

        {weatherError && <p style={{ color: 'red' }}>{weatherError}</p>}

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
