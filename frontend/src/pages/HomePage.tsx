import { useState, useEffect } from "react";
import { SearchBar } from "../components/SearchBar";
import { SecondNavbar } from "../components/SecondNavbar";
import "./HomePage.css";
import { News } from "../types";
import { timeElapsed } from "../functions";
import { Link } from "react-router-dom";

export function HomePage() {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("http://localhost:3500/news");
      if (response.ok) {
        const data: News[] = await response.json();
        setNews(data);
      } else {
        throw new Error("Failed to fetch news");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  return (
    <div className="HomePage">
      <SecondNavbar />
      <SearchBar />
      <div className="NewsContainer">
        <h2 className="latest-news">Latest News</h2>
        <ul>
  {news.reverse().map((news) => (
    <li key={news.id} className="NewsItem">
      <Link to={`/news/${news.id}`} className="NewsItemLink">
        <img src={news.image_url} alt="News" className="NewsItemImage" />
        <div className="NewsItemContent">
          <h3 className="NewsItemTitle">{news.title}</h3>
          <p className="NewsItemCategory">Category: {news.category}</p>
          <p className="NewsItemCreatedAt">Created: {timeElapsed(news.created_at)}</p>
          <p className="NewsItemUserName">Author: {news.userName}</p> 
        </div>
      </Link>
    </li>
  ))}
</ul>
      </div>

    </div>
  );
}
