import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminAbout() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/about`).then((res) => {
      if (res.data) {
        setForm({
          title: res.data.title || "",
          description: res.data.description || "",
          imageUrl: res.data.imageUrl || "",
        });
      }
    }).catch(err => console.log(err));
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    if (file) data.append("image", file);

    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/about/update-with-image`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });


    alert("About Section Updated!");
  };

  return (
    <div>
      <h2>Edit About Section</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="About"
            style={{ width: "200px", marginTop: "10px" }}
          />
        )}

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default AdminAbout;
