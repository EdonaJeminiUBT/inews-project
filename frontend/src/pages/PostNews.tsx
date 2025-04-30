
import "./PostNews.css"

export function PostNews() {


  return (
    <div className="news-posting">
      <h1 className="post-h1">Post News</h1>
      <form className="post-news" >
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          required
        />
        <input
          type="text"
          name="intro"
          id="intro"
          placeholder="Introduction"
          required
        />
        <textarea
          name="news"
          id="news"
          placeholder="Write your news here..."
          rows={7}
          required
        />
        <div className="input-group">
          <input
            type="url"
            name="image"
            id="image"
            placeholder="Image URL"
            required
          />
          <input
            type="url"
            name="video"
            id="video"
            placeholder="Video URL"
          />
        </div>
        <input
          type="text"
          name="category"
          id="category"
          placeholder="Category"
          required
        />
        <input
          type="text"
          name="userName"
          id="userName"
          placeholder="Your name"
        />
        <button type="submit" className="review-btn">
          POST
        </button>
      </form>
    </div>
  );
}
