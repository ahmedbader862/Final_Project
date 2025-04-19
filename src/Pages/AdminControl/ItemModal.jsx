import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ItemModal = ({ showModal, setShowModal, formData, setFormData, handleSubmit, handleDelete, handleAddCategory, selectedItem }) => (
  <Modal show={!!showModal} onHide={() => setShowModal(null)}>
    <Modal.Header closeButton>
      <Modal.Title>
        {showModal === 'add' ? 'Add Item' : showModal === 'edit' ? 'Edit Item' : showModal === 'delete' ? 'Confirm Delete' : 'Add Category'}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {(showModal === 'add' || showModal === 'edit') && (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 ">
            <Form.Label>ID</Form.Label>
            <Form.Control 
              name="id" 
              value={formData.id} 
              onChange={e => setFormData({ ...formData, id: e.target.value })} 
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              name="title" 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              name="description" 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={e => setFormData({ ...formData, price: e.target.value })} 
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control 
              type="file" 
              accept="image/*" 
              onChange={e => setFormData({ ...formData, imageFile: e.target.files[0] })} 
            />
            {(formData.image || formData.imageFile) && (
              <img 
                src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.image} 
                alt="Preview" 
                className="modal-image-preview" 
                onError={(e) => e.target.src = 'https://via.placeholder.com/120'} 
              />
            )}
          </Form.Group>
          <Button type="submit">{showModal === 'add' ? 'Add' : 'Save'}</Button>
        </Form>
      )}
      {showModal === 'delete' && <p>Are you sure you want to delete "{selectedItem?.title}"?</p>}
      {showModal === 'category' && (
        <Form.Group>
          <Form.Label>Category Name</Form.Label>
          <Form.Control 
            value={formData.title} 
            onChange={e => setFormData({ ...formData, title: e.target.value })} 
          />
        </Form.Group>
      )}
    </Modal.Body>
    {showModal === 'delete' && <Modal.Footer><Button variant="danger" onClick={handleDelete}>Delete</Button></Modal.Footer>}
    {showModal === 'category' && <Modal.Footer><Button onClick={handleAddCategory}>Add</Button></Modal.Footer>}
  </Modal>
);

export default ItemModal;