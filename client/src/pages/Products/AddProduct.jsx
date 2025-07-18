import { useState } from 'react';

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    size: '',
    color: '',
    image: null, // Use null for file input; use '' for URL
  });
  const [message, setMessage] = useState('');

  const token = sessionStorage.getItem('token');

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      setMessage('❌ Please log in to add a product.');
      return;
    }

    // Client-side validation
    if (!form.name || !form.description || !form.price || Number(form.price) <= 0) {
      setMessage('❌ Please fill in all required fields with valid data.');
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      const res = await fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Use FormData for file uploads; use JSON.stringify(form) for URL
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Product added successfully!');
        setForm({
          name: '',
          description: '',
          price: '',
          category: '',
          size: '',
          color: '',
          image: null, // Reset to null for file; use '' for URL
        });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || '❌ Failed to add product');
      }
    } catch (err) {
      setMessage('❌ Server error');
      console.error('Submission error:', err);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          min="0.01"
          step="0.01"
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={form.size}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={form.color}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/jpeg,image/png,image/gif"
          className="w-full mb-3 p-2 border rounded"
        />
        {/* For URL-based image input, replace the above with:
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        */}
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}