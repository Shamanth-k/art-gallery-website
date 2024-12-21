// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from "react";
import Navbar from "../components/userNavbar";
import "../styles/Hero.css";
import patternImage from "../assets/pattern.webp"; // Path to the background image
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpeg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpeg";

const HomePage = () => {
  // State for controlling opacity
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Get the height of the navbar (assuming it's a fixed navbar)
    const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;

    // Scroll event listener to update opacity
    const handleScroll = () => {
      const scrollY = window.scrollY - navbarHeight; // Subtract navbar height to adjust for fade effect
      const newOpacity = 1 - scrollY / 200; // Adjust this value to control fading speed
      setOpacity(Math.max(newOpacity, 0)); // Ensure opacity doesn't go below 0
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <div className="hero-section">
        {/* Left Side */}
        <div className="hero-left"></div>

        {/* Right Side */}
        <div className="hero-right"></div>

        {/* Center Content */}
        <div className="hero-content" style={{ opacity: opacity }}>
          <h1 className="hero-title">
            <span className="text-pablo">Pablo</span>
            <span
              className="text-picasso"
              style={{ "--pattern": `url(${patternImage})` }} // Pass background dynamically
            >
              PICASSO
            </span>
          </h1>
          <button
            className="hero-button"
            aria-label="See more details about Pablo Picasso"
          >
            See Details
          </button>
        </div>
      </div>

      {/* Image Gallery Section */}
      <section className="image-gallery">
        <div className="image-container">
          <img src={image1} alt="Artwork 1" className="art-image" />
          <img src={image2} alt="Artwork 2" className="art-image" />
          <img src={image3} alt="Artwork 3" className="art-image" />
          <img src={image4} alt="Artwork 4" className="art-image" />
          <img src={image5} alt="Artwork 5" className="art-image" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
