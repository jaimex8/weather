import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Weather() {
  const API_KEY = "";
  const [weatherData, setWeatherData] = useState(null);  
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("san diego");
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (cityName) => {
    setCity(cityName);
    try {
      setLoading(true)
      setError(null)
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`;
      const response = await fetch(url);
      const data = await response.json();

      setWeatherData(data);

      const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=imperial`;
      const forecastresponse = await fetch(forecasturl);
      const forecastdata = await forecastresponse.json();

      if (forecastdata.list) {
        const dailyForecast = forecastdata.list.filter(
          (item, index) => index % 8 === 0
        );
        setForecast(dailyForecast);
      } else {
        setForecast([]);
        setError("Couldnt fetch data, please try again");
      }

    } catch (error) {
      console.log("error: ");
      console.log(error);
      setError("Couldnt fetch data, please try again");
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchWeatherData(city)
  }, [city])

  function handleSearch(e) {
    e.preventDefault();
    fetchWeatherData(searchInput);
  }

  if (loading) return <div className="wrapper">Loading...</div>

  return (
    <>
      <div className="wrapper">
        <h1>Weather App</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter city name"
            className="search-input"
            required
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {error && <p className="error">{error}</p>}


        <Details value={weatherData} />


        <Forecast value={forecast} />
        
      </div>
    </>
  )
}

function Details({value}) {

  return (
    value && value.main && value.weather &&
    <>
      <div className="header">
        <h2 className="city">{value.name}</h2>
        <p className="temperature">{Math.round(value.main.temp)}°F</p>
        <p className="condition">{value.weather[0].main}
          <img
            src={`http://openweathermap.org/img/wn/${value.weather[0].icon}.png`}
            alt={value.weather[0].description}/>
        </p>
      </div>

      <div className="weather-details">
        <div>
          <p>Humidity</p>
          <p style={{ fontWeight: "bold" }}>{Math.round(value.main.humidity)}%</p>
        </div>
        <div>
          <p>Wind Speed</p>
          <p style={{ fontWeight: "bold" }}>{Math.round(value.wind.speed)} mph</p>
        </div>
      </div>
    </>
  )

}

function Forecast({value}) {

  return (
    value.length > 0 &&
    <>
    <div className="forecast">
      <h2 className="forecast-header">5-Day Forecast</h2>
      <div className="forecast-days">
        {value.map((day, index) => (
          <div key={index} className="forecast-day">
            <p>
              {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </p>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
            />
            <p>{Math.round(day.main.temp)}°F</p>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default Weather
