import React from "react";
import Navbar from "./Navbar";

function Hero() {
  return (
    <div className="hero-section">
      <Navbar />

      <div className="hero-layout">
        {/* Left Main Image Box */}
        <div className="hero-left">
          <div className="hero-text">
            <h1>Zarmina</h1>
            <p>
              Discover the art of traditional luxury, <br/> reimagined for today’s generation — <br/> where every piece is crafted to reflect your unique aura.
            </p>
            <button className="shop-btn">Shop Now</button>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="hero-right">
          <div className="main-image">
            <img src="assets/hero-img1.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
