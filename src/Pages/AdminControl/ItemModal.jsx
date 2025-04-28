import React from 'react';
import { Modal, Form, Button, Image } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';


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

  const validationSchema = Yup.object({
    title: Yup.string()
      .required(text.titleRequired || 'Title is required')
      .min(3, text.titleMin || 'Title must be at least 3 characters'),
    title_ar: Yup.string().min(3, text.titleArMin || 'Arabic title must be at least 3 characters'),
    name_en: Yup.string().min(3, text.nameEnMin || 'English name must be at least 3 characters'),
    name_ar: Yup.string().min(3, text.nameArMin || 'Arabic name must be at least 3 characters'),
    description: Yup.string().max(500, text.descriptionMax || 'Description must be 500 characters or less'),
    desc_ar: Yup.string().max(500, text.descArMax || 'Arabic description must be 500 characters or less'),
    category: Yup.string().required(text.categoryRequired || 'Category is required'),
    category_ar: Yup.string().required(text.categoryArRequired || 'Arabic category is required'),
    price: Yup.number()
      .required(text.priceRequired || 'Price is required')
      .positive(text.pricePositive || 'Price must be positive')
      .min(0.01, text.priceMin || 'Price must be at least 0.01')
      .max(10000, text.priceMax || 'Price must be at most 10000'),
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
      if (showModal === 'addCategory') {
        handleAddCategory();
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
        });
      }
      setFormData({
        title: '',
        title_ar: '',
        name_en: '',
        name_ar: '',
        description: '',
        desc_ar: '',
        category: '',
        category_ar: '',
        price: '',
        image: '',
        imageFile: null,
      });
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

  const isAdd = showModal === 'add';
  const isEdit = showModal === 'edit';
  const isDelete = showModal === 'delete';
  const isAddCategory = showModal === 'addCategory';

  return (
    <Modal
      show={!!showModal}
      onHide={() => setShowModal(null)}
      centered
      dialogClassName="modal-dark"
    >
      {/* <Modal.Header closeButton className="bg-dark text-white border-0">
        <Modal.Title>
          {isAdd && (text.addNewItem || 'Add New Item')}
          {isEdit && (text.editItem || 'Edit Item')}
          {isDelete && (text.confirmDelete || 'Confirm Delete')}
          {isAddCategory && (text.addCategory || 'Add Category')}
        </Modal.Title>
      </Modal.Header> */}
      <Modal.Body className="bg-dark text-white">
        <Form onSubmit={(e) => e.preventDefault()}>
          {isDelete ? (
            <p>
              {text.confirmDelete || 'Are you sure you want to delete'}: <strong>{selectedItem?.title || 'this item'}</strong>?
            </p>
          ) : (
            <>
              {isAddCategory ? (
                <>
                  <Form.Group className="mb-3 ">
                    <Form.Label className='text-white '>{text.categoryNameEn || 'Category Name (English)'}</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={text.categoryNameEn || 'Enter category name'}
                      required
                      className="  text-white border-secondary"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{text.categoryNameAr || 'Category Name (Arabic)'}</Form.Label>
                    <Form.Control
                      type="text"
                      name="category_ar"
                      value={formData.category_ar}
                      onChange={(e) => setFormData({ ...formData, category_ar: e.target.value })}
                      placeholder={text.categoryNameAr || 'Enter Arabic category name'}
                      className="bg-dark text-white border-secondary"
                      style={{ direction: 'rtl', textAlign: 'right' }}
                    />
                  </Form.Group>
                </>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>{text.categoryEn || 'Category (English)'}</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.category && !!formik.errors.category}
                      readOnly={isEdit}
                      required
                      className="bg-dark text-white border-secondary"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.category}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{text.categoryAr || 'Category (Arabic)'}</Form.Label>
                    <Form.Control
                      type="text"
                      name="category_ar"
                      value={formik.values.category_ar}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.category_ar && !!formik.errors.category_ar}
                      readOnly={isEdit}
                      required
                      className="bg-dark text-white border-secondary"
                      style={{ direction: 'rtl', textAlign: 'right' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.category_ar}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{text.titleEn || 'Title (English)'}</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.title && !!formik.errors.title}
                      required
                      className="bg-dark text-white border-secondary"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{text.titleAr || 'Title (Arabic)'}</Form.Label>
                    <Form.Control
                      type="text"
                      name="title_ar"
                      value={formik.values.title_ar}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.title_ar && !!formik.errors.title_ar}
                      className="bg-dark text-white border-secondary"
                      style={{ direction: 'rtl', textAlign: 'right' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.title_ar}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{text.nameEn || 'Name (English)'}</Form.Label>
                    <Form.Control
                      type="text"
                      name="name_en"
                      value={formik.values.name_en}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.name_en && !!formik.errors.name_en}
                      className="bg-dark text-white border-secondary"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.name_en}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{text.nameAr || 'Name (Arabic)'}</Form.Label>
                    <Form.Control
                      type="text"
                      name="name_ar"
                      value={formik.values.name_ar}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.name_ar && !!formik.errors.name_ar}
                      className="bg-dark text-white border-secondary"
                      style={{ direction: 'rtl', textAlign: 'right' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.name_ar}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{text.descriptionEn || 'Description (English)'}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.description && !!formik.errors.description}
                      className="bg-dark text-white border-secondary"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{text.descriptionAr || 'Description (Arabic)'}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="desc_ar"
                      value={formik.values.desc_ar}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.desc_ar && !!formik.errors.desc_ar}
                      className="bg-dark text-white border-secondary"
                      style={{ direction: 'rtl', textAlign: 'right' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.desc_ar}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{text.price || 'Price'}</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.price && !!formik.errors.price}
                      required
                      className="bg-dark text-white border-secondary"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.price}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{text.uploadImage || 'Upload Image'}</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="bg-dark text-white border-secondary"
                    />
                    {(formData.image || formData.imageFile) && (
                      <div className="mt-2">
                        <Image
                          src={
                            formData.imageFile
                              ? URL.createObjectURL(formData.imageFile)
                              : formData.image || 'https://via.placeholder.com/120'
                          }
                          alt="Preview"
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/120')}
                          style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </>
              )}
            </>
          )}
        <div className="d-flex gap-2 mt-4">
  {(isAdd || isEdit || isAddCategory) && (
    <Button
      className="btn btn-primary"
      type="submit"
      onClick={formik.handleSubmit}
    >
      {isAddCategory ? (text.addCategory || 'Add Category') : isAdd ? (text.add || 'Add') : (text.save || 'Save')}
    </Button>
  )}
  {isDelete && (
    <Button
      className="btn btn-danger"
      onClick={handleDelete}
    >
      {text.delete || 'Delete'}
    </Button>
  )}
  <Button
    className="btn btn-secondary"
    onClick={() => setShowModal(null)}
  >
    {text.cancel || 'Cancel'}
  </Button>
</div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ItemModal;
