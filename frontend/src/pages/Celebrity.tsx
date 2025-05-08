import { useState, useEffect } from "react";
import { SecondNavbar } from "../components/SecondNavbar";
import { News } from "../types";
import { timeElapsed } from "../functions";
import { Link } from "react-router-dom";
import '../App.css'

export function Celebrity() {
  const [, setNews] = useState<News[]>([]);
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
        setFilteredNews(data.filter(newsItem => newsItem.category === "celebrities")); 
      } else {
        throw new Error("Failed to fetch news");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  return (
    <div className="CelebrityNewsPage">
      <SecondNavbar />
      <div className="NewsContainer">
        <h2 className="category-news">Celebrity News</h2>
        <ul>
          {filteredNews.map((newsItem) => (
            <li key={newsItem.id} className="NewsItem">
              <Link to={`/news/${newsItem.id}`} className="NewsItemLink">
                <div className="NewsItemContent">
                  <h3 className="NewsItemTitle">{newsItem.title}</h3>
                  <p className="NewsItemCreatedAt">{timeElapsed(newsItem.created_at)}</p>
                  <p className="NewsItemUserName">By: {newsItem.userName} INEWS</p> 
                  <img src={newsItem.image_url} alt="News" className="NewsItemImage" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
