
import { SearchBar } from "../components/SearchBar";
import { SecondNavbar } from "../components/SecondNavbar";
import "./HomePage.css";

export function HomePage() {
  return (
    <div className="HomePage">
      <SecondNavbar/>
      <SearchBar />
    </div>
  );
}