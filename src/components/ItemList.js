import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import EditItem from './EditItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faSpinner,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';

const ItemList = forwardRef((props, ref) => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/items')
      .then(res => {
        setItems(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setDeleteLoading(id);
      axios.delete(`http://localhost:5000/api/items/${id}`)
        .then(() => {
          setItems(items.filter(i => i._id !== id));
          setDeleteLoading(null);
        })
        .catch(err => {
          console.log(err);
          setDeleteLoading(null);
        });
    }
  };

  useImperativeHandle(ref, () => ({
    fetchItems
  }));

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h3 className="mb-0">Inventory Items</h3>
        </div>
        
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-5">
              <FontAwesomeIcon 
                icon={faSpinner} 
                spin 
                className="fa-2x text-muted"
              />
              <p className="mt-3">Loading items...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon
                icon={faBoxOpen}
                className="fa-3x text-muted mb-3"
              />
              <h5>No items found</h5>
              <p className="text-muted">Start by adding new items using the form above</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Item Name</th>
                    <th>Description</th>
                    <th className="text-end">Price</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id}>
                      <td className="fw-semibold">{item.name}</td>
                      <td className="text-muted">{item.description || '-'}</td>
                      <td className="text-end">
                        ${parseFloat(item.price).toFixed(2)}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => setEditingItem(item)}
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item._id)}
                          title="Delete"
                          disabled={deleteLoading === item._id}
                        >
                          {deleteLoading === item._id ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            <FontAwesomeIcon icon={faTrash} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingItem && (
        <EditItem
          item={editingItem}
          fetchItems={fetchItems}
          closeModal={() => setEditingItem(null)}
        />
      )}
    </div>
  );
});

export default ItemList;