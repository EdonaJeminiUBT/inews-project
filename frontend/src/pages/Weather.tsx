import { useState, useEffect } from "react";
import { SearchBar } from "../components/SearchBar";
import { SecondNavbar } from "../components/SecondNavbar";
import "./HomePage.css";
import { convertKelvinToCelsius, timeElapsed } from "../functions";
import weather from '../assets/weather.webp'
import React from "react";

export function Weather() {
  const [weatherData, setWeatherData] = useState<any[]>([]); 
  const [filteredNews, setFilteredNews] = useState<any[]>([]);

  useEffect(() => {
    fetchWeatherNews(); 
  }, []);

  const fetchWeatherNews = async () => {
    try {
      const response = await fetch("http://localhost:3500/weather-news");
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        setFilteredNews(data); 
      } else {
        throw new Error("Failed to fetch weather news");
      }
    } catch (error) {
      console.error("Error fetching weather news:", error);
    }
  };
  
  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredNews([...weatherData]);
    } else {
      const filteredNews = weatherData.filter((newsItem) =>
        (newsItem.city && newsItem.city.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredNews(filteredNews);
    }
  };
  
  return (
    <div className="HomePage">
      <SecondNavbar />
      <div className="categories-header">Search the Weather in Your City ...</div>
      <SearchBar onSearch={handleSearch} />
      <div className="NewsContainer">
        <h2 className="latest-news">Latest News</h2>
        <ul>
          {filteredNews
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) 
            .map((item, index) => (
                <li key={index} className={`NewsItem`}>
                <div className="WeatherItem">
                  <h3 className="NewsItemTitle">Weather in {item.city}, Today</h3>
                  <p className="NewsItemCreatedAt">{timeElapsed(item.created_at)}</p>
                  <p className="NewsItemUserName">By: INEWS</p> 
                  <img
                    className="NewsItemImage"
                    src={weather}
                    alt="weather"
                  />
                  <div className="WeatherItemContent">
                    {item.weatherData && item.weatherData.weather && (
                      <p className="WeatherItemDescription">
                        {item.weatherData.weather[0].description}
                      </p>
                    )}
                    <div className="WeatherItemDetails">
                      <div className="WeatherItemTemperature">
                        {item.weatherData && item.weatherData.main && (
                          <React.Fragment>
                            <img
                              src={`http://openweathermap.org/img/wn/${item.weatherData.weather[0].icon}.png`}
                              alt="Weather Icon"
                            />
                            <p className="WeatherItemTemperature">
                              {convertKelvinToCelsius(item.weatherData.main.temp)}°C
                            </p>
                          </React.Fragment>
                        )}
                      </div>
                      <div className="WeatherItemDetailsInfo">
                        {item.weatherData && item.weatherData.main && item.weatherData.wind && (
                          <React.Fragment>
                            <p>Feels like: {convertKelvinToCelsius(item.weatherData.main.feels_like)}°C</p>
                            <p>Humidity: {item.weatherData.main.humidity}%</p>
                            <p>Wind Speed: {item.weatherData.wind.speed} m/s</p>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
