 import { useState, useEffect } from "react";
import { SearchBar } from "../components/SearchBar";
import { SecondNavbar } from "../components/SecondNavbar";
import "./HomePage.css";
import { News } from "../types";
import { timeElapsed } from "../functions";
import { Link } from "react-router-dom";

export function HomePage() {
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);

  useEffect(() => {
    fetchNews();
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

  
  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredNews(news);
    } else {
      const filteredNews = news.filter((newsItem) =>
        newsItem.title?.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredNews(filteredNews);
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
              <li key={index} className={`NewsItem`}>
                  <Link to={`/news/${item.id}`} className="NewsItemLink">
                    <div className="NewsItemContent">
                      <h3 className="NewsItemTitle">{item.title}</h3>
                      <p className="NewsItemCreatedAt">{timeElapsed(item.created_at)}</p>
                      <p className="NewsItemUserName">By: {item.userName} INEWS</p> 
                      <img src={item.image_url} alt="News" className="NewsItemImage" />
                    </div>
                  </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}