import axios from 'axios';
import React, { useState, useEffect } from 'react';

const CountryDetailPage = ({ country, onClose }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    if (country) {
      fetchWeatherData();
    }
  }, [country]);
  
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area} square kilometers</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img className='flag' src={country.flags.svg} alt={`Flag of ${country.name.common}`} />
      {weatherData && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Humidity: {weatherData.main.humidity} %</p>
          <p>Weather Condition: {weatherData.weather[0].description}</p>
        </div>
      )}
      <button className='btn' onClick={onClose}>Close</button>
    </div>
  );
};

export default CountryDetailPage;
