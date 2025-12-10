import React, { useEffect, useState } from "react";
import axios from "axios";

function Aboutus() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:4000/about")
      .then((res) => setAbout(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!about) return null;

  return (
    <div id="about" className="aboutus">
      
      <div className="right-section">
        <img
          src={about.imageUrl}
          alt="About Us"
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </div>

      <div className="left-section">
        <p>About Us</p>
        <h2>{about.title}</h2>
        <p>{about.description}</p>
      </div>

    </div>
  );
}

export default Aboutus;
