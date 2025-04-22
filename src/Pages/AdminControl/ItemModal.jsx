import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ItemModal = ({ showModal, setShowModal, formData, setFormData, handleSubmit, handleDelete, handleAddCategory, selectedItem }) => {
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters'),
    description: Yup.string()
      .max(500, 'Description cannot exceed 500 characters'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be a positive number')
      .min(0.01, 'Price must be at least $0.01')
      .max(10000, 'Price cannot exceed $10,000'),
  });

  const formik = useFormik({
    initialValues: {
      title: formData.title || '',
      description: formData.description || '',
      price: formData.price || '',
      imageFile: formData.imageFile || null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit({
        title: values.title,
        description: values.description,
        price: values.price,
        imageFile: values.imageFile,
      });
      setFormData({ title: '', description: '', price: '', image: '', imageFile: null });
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue('imageFile', file);
    setFormData({
      ...formData,
      imageFile: file,
      title: formik.values.title,
      description: formik.values.description,
      price: formik.values.price,
    });
  };

  return (
    <Modal show={!!showModal} onHide={() => setShowModal(null)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {showModal === 'add' ? 'Add Item' : showModal === 'edit' ? 'Edit Item' : showModal === 'delete' ? 'Confirm Delete' : 'Add Category'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(showModal === 'add' || showModal === 'edit') && (
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.title && !!formik.errors.title}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.title}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.description && !!formik.errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label >Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.price && !!formik.errors.price}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.price}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {(formData.image || formData.imageFile) && (
                <img
                  src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.image}
                  alt="Preview"
                  className="modal-image-preview"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/120')}
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </Form.Group>
        )}
      </Modal.Body>
      {showModal === 'delete' && (
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      )}
      {showModal === 'category' && (
        <Modal.Footer>
          <Button onClick={handleAddCategory}>Add</Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ItemModal;