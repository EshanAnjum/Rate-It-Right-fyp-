import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css"; // Import external CSS for styling
import HomePage from "./HomePage";
import NewComparisonPage from "./NewComparisonPage";
import NewRecommenderPage from "./NewRecommenderPage";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnalyzerPage from "./AnalyzerPage";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/newcomparisonpage" element={<NewComparisonPage />} />
        <Route path="/analyzerpage" element={<AnalyzerPage />} />
        <Route path="/newrecommenderpage" element={<NewRecommenderPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
