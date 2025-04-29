import React, { useState } from 'react';
import { Modal, Form, Button, Image, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp for Firestore

const ItemModal = ({
  showModal,
  setShowModal,
  formData,
  setFormData,
  handleSubmit,
  handleDelete,
  handleAddCategory,
  selectedItem,
  categories,
  selectedCategory,
}) => {
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required(text.titleRequired || 'Title is required')
      .min(3, text.titleMin || 'Title must be at least 3 characters'),
    title_ar: Yup.string()
      .required(text.titleArRequired || 'Arabic title is required')
      .min(3, text.titleArMin || 'Arabic title must be at least 3 characters'),
    name_en: Yup.string()
      .required(text.nameEnRequired || 'English name is required')
      .min(3, text.nameEnMin || 'English name must be at least 3 characters'),
    name_ar: Yup.string()
      .required(text.nameArRequired || 'Arabic name is required')
      .min(3, text.nameArMin || 'Arabic name must be at least 3 characters'),
    description: Yup.string()
      .required(text.descriptionRequired || 'Description is required')
      .max(500, text.descriptionMax || 'Description must be 500 characters or less'),
    desc_ar: Yup.string()
      .required(text.descArRequired || 'Arabic description is required')
      .max(500, text.descArMax || 'Arabic description must be 500 characters or less'),
    category: Yup.string()
      .required(text.categoryRequired || 'Category is required'),
    category_ar: Yup.string()
      .required(text.categoryArRequired || 'Arabic category is required'),
    price: Yup.number()
      .required(text.priceRequired || 'Price is required')
      .positive(text.pricePositive || 'Price must be positive')
      .min(0.01, text.priceMin || 'Price must be at least 0.01')
      .max(10000, text.priceMax || 'Price must be at most 10000'),
    imageFile: Yup.mixed()
      .required(text.imageRequired || 'Image is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: formData.title || '',
      title_ar: formData.title_ar || '',
      name_en: formData.name_en || '',
      name_ar: formData.name_ar || '',
      description: formData.description || '',
      desc_ar: formData.desc_ar || '',
      category: formData.category || '',
      category_ar: formData.category_ar || '',
      price: formData.price || '',
      imageFile: formData.imageFile || null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log('ItemModal submitting values:', values);
      const currentTimestamp = Timestamp.fromDate(new Date()); // Create Firestore timestamp
      if (showModal === 'addCategory') {
        handleAddCategory();
        setShowModal(null);
        setShowErrorAlert(false);
      } else {
        handleSubmit({
          title: values.title,
          title_ar: values.title_ar,
          name_en: values.name_en,
          name_ar: values.name_ar,
          description: values.description,
          desc_ar: values.desc_ar,
          category: values.category,
          category_ar: values.category_ar,
          price: values.price,
          imageFile: values.imageFile,
          createdAt: currentTimestamp, // Add timestamp to the data
        });
        setShowModal(null);
        setShowErrorAlert(false);
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Selected image file:', file);
    formik.setFieldValue('imageFile', file);
    setFormData({
      ...formData,
      imageFile: file,
      title: formik.values.title,
      title_ar: formik.values.title_ar,
      name_en: formik.values.name_en,
      name_ar: formik.values.name_ar,
      description: formik.values.description,
      desc_ar: formik.values.desc_ar,
      category: formik.values.category,
      category_ar: formik.values.category_ar,
      price: formik.values.price,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
    if (Object.keys(formik.errors).length > 0) {
      setShowErrorAlert(true);
    }
  };

  const isAdd = showModal === 'add';
  const isEdit = showModal === 'edit';
  const isDelete = showModal === 'delete';
  const isAddCategory = showModal === 'addCategory';

  return (
    <>
      <style>
        {`
          .modal-dark .modal-content {
            background-color: #2a2a2a;
            border: none;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }

          .modal-dark .modal-header {
            border-bottom: 1px solid #444;
          }

          .modal-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #fff;
          }

          .modal-dark .modal-body {
            padding: 1.5rem;
          }

          .form-label {
            color: #ccc;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
          }

          .form-control.bg-dark {
            background-color: #3a3a3a !important;
            border-color: #5a5a5a !important;
            color: #fff !important;
            border-radius: 8px;
            font-size: 0.9rem;
            padding: 0.75rem;
          }

          .modal-image-preview {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 50%;
            border: 2px solid #e0e0e0;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
            margin: 15px auto;
            display: block;
          }

          .modal-delete-text {
            font-size: 1rem;
            color: #fff;
          }

          .modal-btn {
            font-size: 0.9rem;
            padding: 0.5rem 1.5rem;
            border-radius: 20px;
            transition: background-color 0.3s ease, transform 0.1s ease;
          }

          .modal-btn:hover {
            transform: scale(1.05);
          }

          .btn-primary {
            background-color: #4A919E;
            border-color: #4A919E;
          }

          .btn-primary:hover {
            background-color: #3A7D8C;
            border-color: #3A7D8C;
          }

          .btn-danger {
            background-color: #B73E3E;
            border-color: #B73E3E;
          }

          .btn-danger:hover {
            background-color: #9A3434;
            border-color: #9A3434;
          }

          .btn-secondary {
            background-color: #6c757d;
            border-color: #6c757d;
          }

          .btn-secondary:hover {
            background-color: #5a6268;
            border-color: #5a6268;
          }

          .alert-danger {
            background-color: #ff4d4f;
            color: #fff;
            border: none;
            border-radius: 8px;
            margin-bottom: 1rem;
          }

          @media (max-width: 768px) {
            .modal-title {
              font-size: 1.25rem;
            }

            .form-label {
              font-size: 0.85rem;
            }

            .form-control {
              font-size: 0.85rem;
              padding: 0.6rem;
            }

            .form-control-feedback {
              font-size: 0.75rem;
            }

            .modal-btn {
              font-size: 0.85rem;
              padding: 0.4rem 1.2rem;
            }

            .alert-danger {
              font-size: 0.85rem;
            }
          }
        `}
      </style>
      <Modal
        show={!!showModal}
        onHide={() => {
          setShowModal(null);
          setShowErrorAlert(false);
        }}
        centered
        dialogClassName="modal-dark"
      >
        <Modal.Body className="bg-dark text-white">
          {showErrorAlert && (
            <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
              {text.formError || 'Please fill out all required fields correctly.'}
            </Alert>
          )}
          <Form noValidate onSubmit={handleFormSubmit}>
            {isDelete ? (
              <p className="modal-delete-text">
                {text.confirmDelete || 'Are you sure you want to delete'}: <strong>{selectedItem?.title || 'this item'}</strong>?
              </p>
            ) : (
              <>
                {isAddCategory ? (
                  <div className="row">
                    <Form.Group className="mb-3 col-md-6">
                      <Form.Label className="form-label">{text.categoryNameEn || 'Category Name (English)'}</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder={text.categoryNameEn || 'Enter category name'}
                        required
                        className="form-control bg-dark text-white border-secondary"
                        isInvalid={formik.touched.title && !!formik.errors.title}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.title}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3 col-md-6">
                      <Form.Label className="form-label">{text.categoryNameAr || 'Category Name (Arabic)'}</Form.Label>
                      <Form.Control
                        type="text"
                        name="category_ar"
                        value={formData.category_ar}
                        onChange={(e) => setFormData({ ...formData, category_ar: e.target.value })}
                        placeholder={text.categoryNameAr || 'Enter Arabic category name'}
                        required
                        className="form-control bg-dark text-white border-secondary"
                        style={{ direction: 'rtl', textAlign: 'right' }}
                        isInvalid={formik.touched.category_ar && !!formik.errors.category_ar}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.category_ar}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                ) : (
                  <>
                    <div className="row">
                      <Form.Group className="mb-3 col-md-6">
                        <Form.Label className="form-label">{text.categoryEn || 'Category (English)'}</Form.Label>
                        <Form.Control
                          type="text"
                          name="category"
                          value={formik.values.category}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.category && !!formik.errors.category}
                          readOnly={isEdit}
                          required
                          className="form-control bg-dark text-white border-secondary"
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.category}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6">
                        <Form.Label className="form-label">{text.categoryAr || 'Category (Arabic)'}</Form.Label>
                        <Form.Control
                          type="text"
                          name="category_ar"
                          value={formik.values.category_ar}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.category_ar && !!formik.errors.category_ar}
                          readOnly={isEdit}
                          required
                          className="form-control bg-dark text-white border-secondary"
                          style={{ direction: 'rtl', textAlign: 'right' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.category_ar}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="row">
                      <Form.Group className="mb-3 col-md-6">
                        <Form.Label className="form-label">{text.titleEn || 'Title (English)'}</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formik.values.title}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.title && !!formik.errors.title}
                          required
                          className="form-control bg-dark text-white border-secondary"
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.title}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6">
                        <Form.Label className="form-label">{text.titleAr || 'Title (Arabic)'}</Form.Label>
                        <Form.Control
                          type="text"
                          name="title_ar"
                          value={formik.values.title_ar}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.title_ar && !!formik.errors.title_ar}
                          required
                          className="form-control bg-dark text-white border-secondary"
                          style={{ direction: 'rtl', textAlign: 'right' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.title_ar}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="row">
                      <Form.Group className="mb-3 col-md-6">
                        <Form.Label className="form-label">{text.nameEn || 'Name (English)'}</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_en"
                          value={formik.values.name_en}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.name_en && !!formik.errors.name_en}
                          required
                          className="form-control bg-dark text-white border-secondary"
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.name_en}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6">
                        <Form.Label className="form-label">{text.nameAr || 'Name (Arabic)'}</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_ar"
                          value={formik.values.name_ar}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.name_ar && !!formik.errors.name_ar}
                          required
                          className="form-control bg-dark text-white border-secondary"
                          style={{ direction: 'rtl', textAlign: 'right' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.name_ar}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="row">
                      <Form.Group className="mb-3 col-md-6">
                        <Form.Label className="form-label">{text.descriptionEn || 'Description (English)'}</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.description && !!formik.errors.description}
                          required
                          className="form-control bg-dark text-white border-secondary"
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6">
                        <Form.Label className="form-label">{text.descriptionAr || 'Description (Arabic)'}</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="desc_ar"
                          value={formik.values.desc_ar}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.desc_ar && !!formik.errors.desc_ar}
                          required
                          className="form-control bg-dark text-white border-secondary"
                          style={{ direction: 'rtl', textAlign: 'right' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.desc_ar}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="row">
                      <Form.Group className="mb-3 col-md-6">
                        <Form.Label className="form-label">{text.price || 'Price'}</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          name="price"
                          value={formik.values.price}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.price && !!formik.errors.price}
                          required
                          className="form-control bg-dark text-white border-secondary"
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.price}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6">
                        <Form.Label className="form-label">{text.uploadImage || 'Upload Image'}</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="form-control bg-dark text-white border-secondary"
                          isInvalid={formik.touched.imageFile && !!formik.errors.imageFile}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.imageFile}
                        </Form.Control.Feedback>
                        {(formData.image || formData.imageFile) && (
                          <div className="mt-3 text-center">
                            <Image
                              src={
                                formData.imageFile
                                  ? URL.createObjectURL(formData.imageFile)
                                  : formData.image || 'https://via.placeholder.com/120'
                              }
                              alt="Preview"
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/120')}
                              className="modal-image-preview"
                            />
                          </div>
                        )}
                      </Form.Group>
                    </div>
                  </>
                )}
              </>
            )}
            <div className="d-flex justify-content-end gap-2 mt-4">
              {(isAdd || isEdit || isAddCategory) && (
                <Button
                  className="btn btn-primary modal-btn"
                  type="submit"
                >
                  {isAddCategory ? (text.addCategory || 'Add Category') : isAdd ? (text.add || 'Add') : (text.save || 'Save')}
                </Button>
              )}
              {isDelete && (
                <Button
                  className="btn btn-danger modal-btn"
                  onClick={handleDelete}
                >
                  {text.delete || 'Delete'}
                </Button>
              )}
              <Button
                className="btn btn-secondary modal-btn"
                onClick={() => {
                  setShowModal(null);
                  setShowErrorAlert(false);
                }}
              >
                {text.cancel || 'Cancel'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ItemModal;