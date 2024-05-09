import { useState, useEffect } from "react";
import { SearchBar } from "../components/SearchBar";
import { SecondNavbar } from "../components/SecondNavbar";
import "./HomePage.css";
import { News } from "../types";
import { convertKelvinToCelsius, timeElapsed } from "../functions";
import { Link } from "react-router-dom";
import weather from '../assets/weather.webp'

export function Weather() {
  const [news, setNews] = useState<News[]>([]);
  const [weatherData, setWeatherData] = useState<any[]>([]); 
  const [filteredNews, setFilteredNews] = useState<any[]>([]);

  useEffect(() => {
    fetchNews();
    fetchWeatherNews(); 
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("http://localhost:3500/news");
      if (response.ok) {
        const data: News[] = await response.json();
        setNews(data);
        setFilteredNews(data); 
      } else {
        throw new Error("Failed to fetch news");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchWeatherNews = async () => {
    try {
      const response = await fetch("http://localhost:3500/weather-news");
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        throw new Error("Failed to fetch weather news");
      }
    } catch (error) {
      console.error("Error fetching weather news:", error);
    }
  };
  
  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredNews([...news, ...weatherData]);
    } else {
      const filteredData = [...news, ...weatherData].filter((item) => {
        return (
          item.title?.toLowerCase().includes(query.toLowerCase()) ||
          (item.weatherData &&
            [item.weatherData.city, item.weatherData.country, item.weatherData.description]
              .join(' ')
              .toLowerCase()
              .includes(query.toLowerCase()))
        );
      });
  
      setFilteredNews(filteredData);
    }
  };
  
  

  return (
    <div className="HomePage">
      <SecondNavbar />
      <SearchBar onSearch={handleSearch} />
      <div className="NewsContainer">
        <h2 className="latest-news">Latest News</h2>
        <ul>
          {filteredNews
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) 
            .map((item, index) => (
              <li key={index} className={`NewsItem ${item.category === 'weather' ? 'WeatherItem' : ''}`}>
                {item.category === 'weather' ? (
                   <div className="WeatherItem">
                   <h3 className="NewsItemTitle">Weather in {item.city}, Today</h3>
                   <p className="NewsItemCreatedAt">{timeElapsed(item.created_at)}</p>
                      <p className="NewsItemUserName">By: {item.userName} INEWS</p> 
                   <img
                     className="NewsItemImage"
                     src={weather}
                     alt="weather"
                   />
                   <div className="WeatherItemContent">
                     <p className="WeatherItemDescription">{item.weatherData.weather[0].description}</p>
                     <div className="WeatherItemDetails">
                       <div className="WeatherItemTemperature">
                         <img
                           src={`http://openweathermap.org/img/wn/${item.weatherData.weather[0].icon}.png`}
                           alt="Weather Icon"
                         />
                         <p className="WeatherItemTemperature">{convertKelvinToCelsius(item.weatherData.main.temp)}°C</p>
                       </div>
                       <div className="WeatherItemDetailsInfo">
                         <p>Feels like: {convertKelvinToCelsius(item.weatherData.main.feels_like)}°C</p>
                         <p>Humidity: {item.weatherData.main.humidity}%</p>
                         <p>Wind Speed: {item.weatherData.wind.speed} m/s</p>
                       </div>
                     </div>
                   </div>
                 </div>
                ) : (
                  <Link to={`/news/${item.id}`} className="NewsItemLink">
                    <div className="NewsItemContent">
                      <h3 className="NewsItemTitle">{item.title}</h3>
                      <p className="NewsItemCreatedAt">{timeElapsed(item.created_at)}</p>
                      <p className="NewsItemUserName">By: {item.userName} INEWS</p> 
                      <img src={item.image_url} alt="News" className="NewsItemImage" />
                    </div>
                  </Link>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

