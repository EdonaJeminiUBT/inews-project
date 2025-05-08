import "./SearchBar.css"
import newsimg from '../assets/newsimg.jpg';



export function SearchBar() {

  return (
    <div className="news-search">
      <form
        className="news-search-form"

      >
        <input
          className="news-search-input"
          name="search"
          type="text"
          placeholder="Search news..."
        />
        <button className="news-search-btn">Search</button>
      </form>
      <div className="image-container">
        <img src={newsimg} alt="newsimg" style={{ width: '200px', height: 'auto' }} />
      </div>
    </div>
  );
}
