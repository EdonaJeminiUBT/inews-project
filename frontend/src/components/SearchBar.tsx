import { ChangeEvent, FormEvent, useState } from 'react';
import "./SearchBar.css";
import newsimg from '../assets/newsimg.jpg'
export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="news-search">
      <form
        className="news-search-form"
        onSubmit={handleSubmit}
      >
        <input
          className="news-search-input"
          name="search"
          type="text"
          placeholder="Search news..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button type="submit" className="news-search-btn">Search</button>
      </form>
      <div className="image-container">
        <img src={newsimg} alt="newsimg" style={{ width: '200px', height: 'auto' }} />
      </div>
    </div>
  );
}
