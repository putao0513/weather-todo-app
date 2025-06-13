const fetchWeather = () => {
  if (!city.trim()) return;

  let cityToSearch = city.trim();
  const isChinese = /[\u4e00-\u9fa5]/.test(cityToSearch);

  console.log('原始输入：', cityToSearch);

  // 中文 → 拼音
  if (isChinese) {
    const pyArr = pinyin(cityToSearch, { style: pinyin.STYLE_NORMAL });
    console.log('拼音数组：', pyArr);
    cityToSearch = pyArr.flat().join('');
    console.log('拼音拼接后：', cityToSearch);
  }

  const query = `${cityToSearch},cn`;
  const finalUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${WEATHER_API_KEY}&units=metric`;
  console.log('最终请求 URL：', finalUrl);

  setWeatherError('');
  fetch(finalUrl)
    .then(res => {
      if (!res.ok) throw new Error('城市不存在或拼写错误。请确认拼写，或尝试输入拼音');
      return res.json();
    })
    .then(data => {
      console.log('天气数据返回成功 ✅：', data);
      setWeather(data);
    })
    .catch(err => {
      console.error('请求失败 ❌：', err);
      setWeather(null);
      setWeatherError(err.message);
    });
};
