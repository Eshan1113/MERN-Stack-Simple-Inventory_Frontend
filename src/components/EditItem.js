import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const EditItem = ({ item, fetchItems, closeModal }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description,
    price: item.price
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await axios.put(`http://localhost:5000/api/items/${item._id}`, {
        ...formData,
        price: Number(formData.price)
      });
      await fetchItems();
      closeModal();
      alert("Item updated successfully!");
    } catch (err) {
      console.error(err);
      setError('Failed to update item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={true} onHide={closeModal} centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FontAwesomeIcon icon={faSave} className="me-2" />
          Edit Item
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter item name"
              className="py-2"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add description"
              className="py-2"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Price</Form.Label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="Enter price"
                className="py-2"
              />
            </div>
          </Form.Group>

          {error && <div className="text-danger mb-3">{error}</div>}

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button 
              variant="outline-secondary" 
              onClick={closeModal}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faTimes} className="me-2" />
              Cancel
            </Button>
            
            <Button 
              variant="primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditItem;