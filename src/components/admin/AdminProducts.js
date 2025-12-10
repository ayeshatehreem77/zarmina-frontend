import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminProducts({ triggerAlert }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "DIOR",
    price: "",
    description: "",
    imageUrl: "",
    stock: "",
  });

  const token = localStorage.getItem("token");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(res.data || []);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  // Open Add Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      brand: "DIOR",
      price: "",
      description: "",
      imageUrl: "",
      stock: "",
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
    setShowModal(true);
  };

  // Save Product
  const saveProduct = async () => {
    try {
      const dataToSend = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (editingProduct) {
        // Update
        await axios.put(
          `http://localhost:4000/products/${editingProduct._id}`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProduct._id ? { ...p, ...dataToSend } : p
          )
        );

        triggerAlert("success", "Product updated successfully!");
      } else {
        // Create new
        const res = await axios.post(
          `http://localhost:4000/products`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProducts((prev) => [...prev, res.data]);
        triggerAlert("success", "Product added successfully!");
      }

      setShowModal(false);
    } catch (err) {
      console.error("Error saving product:", err);
      triggerAlert("danger", err.response?.data?.message || "Error saving product");
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
  try {
    await axios.delete(`http://localhost:4000/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setProducts(products.filter((p) => p._id !== id));
    triggerAlert("danger", "Product deleted!");
  } catch (err) {
    triggerAlert("danger", "Error deleting product");
  }
};


  return (
    <>
      <h2 className="mb-4">🛍 Products Management</h2>

      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        ➕ Add Product
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>{p.description}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => openEditModal(p)}
                  >
                    Edit
                  </button>

                  <button
  className="btn btn-danger btn-sm"
  onClick={() => deleteProduct(p._id)}
>
  Delete
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div
            className="modal-container bg-white p-4 rounded shadow"
            style={{ width: "450px", margin: "80px auto" }}
          >
            <h4>{editingProduct ? "Edit Product" : "Add Product"}</h4>

            <input
              className="form-control my-2"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            {/* Brand Dropdown */}
            <select
              className="form-control my-2"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            >
              <option value="DIOR">DIOR</option>
              <option value="CHANEL">CHANEL</option>
              <option value="GUCCI">GUCCI</option>
            </select>

            <input
              className="form-control my-2"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />

            <input
              className="form-control my-2"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />

            <input
              className="form-control my-2"
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
            />

            <textarea
              className="form-control my-2"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <button className="btn btn-success mt-2" onClick={saveProduct}>
              Save
            </button>
            <button
              className="btn btn-secondary mt-2 ms-2"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminProducts;
