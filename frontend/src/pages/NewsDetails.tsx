import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { News } from '../types';
import "./NewsDetails.css"
import { timeElapsed } from '../functions';
export function NewsDetails() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);

  useEffect(() => {
    const fetchNewsById = async () => {
      try {
        const response = await fetch(`http://localhost:3500/news/${id}`);
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        } else {
          throw new Error('Failed to fetch news by ID');
        }
      } catch (error) {
        console.error('Error fetching news by ID:', error);
      }
    };

    fetchNewsById();
  }, [id]);

  if (!news) {
    return <p>Loading...</p>;
  }

  return (
    <div className="news-details">
      <h2>{news.title}</h2>
      <p>By {news.userName}, INEWS</p>
      <p className="NewsItemCreatedAt">{timeElapsed(news.created_at)}</p>
      <img src={news.image_url} alt="News" />
      <p>{news.description}</p>
    </div>
  );
}
