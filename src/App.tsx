import "./App.css";
import MultiApiFetch from "./components/ArtworkList";
import { Header } from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SearchApiFetch } from "./components/Search";
import { ArtworkDetail } from "./components/ArtworkDetails";
import { ExhibitionProvider } from "./components/ExhibitionContext";
import ExhibitionList from "./components/ExhibitionList";
import ExhibitionDetail from "./components/ExhibitionDetails";
import { NavigationBar } from "./components/NavBar";
import { Home } from "./components/Home";
import { Footer } from "./components/Footer";

function App() {
  return (
    <>
      <div className="body">
        <Header />
        <ExhibitionProvider>
          <Router>
            <NavigationBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/artworks" element={<MultiApiFetch />} />
              <Route path="/search-results" element={<SearchApiFetch />} />
              <Route path="/artwork/:artworkId" element={<ArtworkDetail />} />
              <Route path="/exhibitions" element={<ExhibitionList />} />
              <Route
                path="/exhibitions/:exhibitionId"
                element={<ExhibitionDetail />}
              />
            </Routes>
          </Router>
          <Footer />
        </ExhibitionProvider>
      </div>
    </>
  );
}

export default App;
