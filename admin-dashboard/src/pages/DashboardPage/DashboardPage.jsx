import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ProductTable from '../../components/ProductTable.jsx';
import './DashboadPage.css';

const initialForm = {
  name: '',
  price: '',
  quantity: '',
  image: '',
  description: '',
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/products');
      setProducts(data.products || []);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Auto-refresh products every 5 seconds to reflect stock changes after orders.
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setCreating(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity || 0),
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage('Product updated successfully.');
      } else {
        await api.post('/products', payload);
        setMessage('Product created successfully.');
      }

      setEditingId('');
      setFormData(initialForm);
      await fetchProducts();
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.msg;

      if (editingId && status === 404) {
        setError('Update API not found (PUT /api/products/:id). Restart backend server after adding the route.');
      } else {
        setError(
          serverMessage ||
            (editingId ? 'Failed to update product.' : 'Failed to create product.')
        );
      }
    } finally {
      setCreating(false);
    }
  };

  const handleStartEdit = (product) => {
    setMessage('');
    setError('');
    setEditingId(product._id);
    setFormData({
      name: product.name || '',
      price: String(product.price ?? ''),
      quantity: String(product.quantity ?? 0),
      image: product.image || '',
      description: product.description || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId('');
    setFormData(initialForm);
    setMessage('');
    setError('');
  };

  const handleDelete = async (id) => {
    setMessage('');
    setError('');
    setDeletingId(id);

    try {
      await api.delete(`/products/${id}`);
      setMessage('Product deleted successfully.');
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete product.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <main className="dashboard-page">
      <header className="top-bar">
        <div>
          <h1>Admin Dashboard</h1>
          <p>{user?.email || 'Admin session'}</p>
        </div>
        <button className="secondary-btn" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="panel">
        <h2>{editingId ? 'Update Product' : 'Add Product'}</h2>
        <form onSubmit={handleCreate} className="create-form">
          <label>
            Name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Price
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Quantity
            <input
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Image URL
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <div className="row-actions">
            <button type="submit" disabled={creating}>
              {creating ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="secondary-btn"
                onClick={handleCancelEdit}
                disabled={creating}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-title-row">
          <h2>Products</h2>
          <button className="secondary-btn" onClick={fetchProducts}>
            Refresh
          </button>
        </div>

        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {loading ? (
          <p className="muted-text">Loading products...</p>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleStartEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
      </section>
    </main>
  );
};

export default DashboardPage;
