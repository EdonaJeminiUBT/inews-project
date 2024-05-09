import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import { SignInPage } from "./pages/SignInPage";
import { HomePage } from "./pages/HomePage";
import { Navbar } from "./components/Navbar";
import { NewsDetails } from "./pages/NewsDetails";
import { General } from "./pages/General";
import { Politics } from "./pages/Politics";
import { Socialmedia } from "./pages/Socialmedia";
import { Books } from "./pages/Books";
import { Movies } from "./pages/Movies";
import { Celebrity } from "./pages/Celebrity";
import { PostNews } from "./pages/PostNews";
import { Profile } from "./pages/Profile";
import { Footer } from "./components/Footer";
import { SignUpPage } from "./pages/SignUpPage";
import { EditNews } from "./pages/EditNews";
import { Weather } from "./pages/Weather";


function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [location]);

;

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
      <Route path="*" element={<Navigate to="/signin" />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/general" element={<General />} />
        <Route path="/politics" element={<Politics />} />
        <Route path="/socialmedia" element={<Socialmedia />} />
        <Route path="/books" element={<Books />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/celebrity" element={<Celebrity />} />
        <Route path="/post" element={<PostNews />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit/:id" element={<EditNews />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/news/:id" element={<NewsDetails />} />
              </Routes>
      <Footer />
    </div>
  );
}

export default App;
