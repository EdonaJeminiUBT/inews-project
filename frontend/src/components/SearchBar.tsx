import "./SearchBar.css"



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
    </div>
  );
}
