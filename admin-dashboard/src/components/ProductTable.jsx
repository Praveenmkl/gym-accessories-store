const ProductTable = ({ products, onEdit, onDelete, deletingId }) => {
  if (!products.length) {
    return <p className="empty-state">No products found.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>LKR {Number(product.price).toFixed(2)}</td>
              <td>{Number.isFinite(product.quantity) ? product.quantity : 0}</td>
              <td>{product.description || '-'}</td>
              <td>
                {product.image ? (
                  <a href={product.image} target="_blank" rel="noreferrer">
                    View
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <div className="row-actions">
                  <button className="secondary-btn" onClick={() => onEdit(product)}>
                    Edit
                  </button>
                  <button
                    className="danger-btn"
                    onClick={() => onDelete(product._id)}
                    disabled={deletingId === product._id}
                  >
                    {deletingId === product._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
