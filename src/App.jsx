import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = '0ff6c4263d27a4af4055b50acbaa11a7';

  function handleInput(event) {
    setCity(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    localStorage.setItem("lastCity", city);

    fetchWeather();

  }

  useEffect(() => {
    const savedCity = localStorage.getItem('lastCity');

    if (savedCity) {
      setCity(savedCity)
    }
  }, [])

  const fetchWeather = async () => {
    if (!city) return;

    setError(null);
    setWeatherData(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        setError(data.message);
      } else {
        setWeatherData(data);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  let theme = "default";

  if (weatherData) {
    const temp = weatherData.main.temp;

    if (temp <= 5) theme = "cold";
    else if (temp <= 20) theme = "cool";
    else if (temp <= 30) theme = "warm";
    else theme = "hot";
  };



  return (
    <div className={`app-container ${theme}`}>



      {weatherData && (
        <div className='weather-info-card'>
          <h3>{weatherData.name}</h3>
          <div className='weather-info-details'>

            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            <p id='temp'>{Math.round(weatherData.main.temp)}°C</p>
            <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
            <p>{weatherData.weather[0].main}</p>
          </div>
        </div>
      )}

      <div className='input-card'>

        <h1>Weather App</h1>
        <form onSubmit={handleSubmit}>
          <input value={city} onChange={handleInput} placeholder="Enter city" />
          <button type="submit" id='getWeatherButton'>Get Weather</button>
          
          <h4>Popular Choices:</h4>
          <div className='showcase'>
            <button onClick={() => setCity('Chillan')}>Chillan</button>
            <button onClick={() => setCity('London')}>London</button>
            <button onClick={() => setCity('Yakutsk')}>Yakutsk</button>
          </div>

        </form>

        {!weatherData && <p>Search for a city to see the current weather 🌤️</p>}
        {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}
        
      </div>
    </div>
  );
}

export default App
