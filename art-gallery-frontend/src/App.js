// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import NavbarWrapper from "./components/NavbarWrapper";
import HomePage from "./pages/HomePage";
import LoginPage from "./components/LoginPage";
import AdminPage from "./pages/AdminPage";
import ArtistPage from "./pages/ArtistPage";
import ExhibitionPage from "./pages/ExhibitionPage";
import TicketPurchase from "./pages/TicketPurchase";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import ArtistDetails from "./components/ArtistDetails";
import Works from "./components/Works";
import "./styles/App.css";

const App = () => {
  return (
    <Router>
      {/* <NavbarWrapper /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/artist" element={<ArtistPage />} />
        <Route path="/exhibitions" element={<ExhibitionPage />} />
        <Route path="/tickets/:exhibitionId" element={<TicketPurchase />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/artists" element={<ArtistDetails />} />
        <Route path="/about" element={<Works />} />
        <Route path="/contact" element={<Footer />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
