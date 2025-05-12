import { ChangeEvent, FormEvent, useState } from 'react';
import "./SearchBar.css";
import { CiSearch } from 'react-icons/ci';
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
        <div className="input-with-button">
          <input
            className="news-search-input"
            name="search"
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button type="submit" className="news-search-btn"><CiSearch /></button>
        </div>
      </form>
    </div>
  );
}
