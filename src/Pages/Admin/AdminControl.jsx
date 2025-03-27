import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, doc } from 'firebase/firestore';
import { Container, Row, Col, Button, Card, Modal, Form, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

// Custom CSS for image styling
const styles = `
  .menu-card-img {
    width: 180px; /* Slightly larger square */
    height: 180px;
    object-fit: cover; /* Maintain aspect ratio */
    border-radius: 50%; /* Circular images for a modern look */
    border: 2px solid #e0e0e0; /* Subtle border */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */
    margin: 15px auto; /* Center with some spacing */
    display: block;
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth hover effect */
  }

  .menu-card-img:hover {
    transform: scale(1.05); /* Slight zoom on hover */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
  }

  .modal-image-preview {
    width: 120px; /* Smaller square for modal */
    height: 120px;
    object-fit: cover;
    border-radius: 50%; /* Circular preview */
    border: 2px solid #e0e0e0;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    margin: 15px auto;
    display: block;
  }

  .card-body {
    text-align: center; /* Center the content below the image */
    padding: 15px;
  }

  .card {
    border: none; /* Remove default card border for a cleaner look */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle card shadow */
    border-radius: 12px; /* Rounded card corners */
  }
`;

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ id: '', title: '', description: '', price: '', image: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    getDocs(collection(db, 'menu')).then(snapshot => {
      const loadedCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(loadedCategories);
      setSelectedCategory(loadedCategories[0]?.id);
    }).catch(error => {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    });
  }, [user]);

  useEffect(() => {
    if (!selectedCategory) return;
    const unsubscribe = onSnapshot(collection(db, `menu/${selectedCategory}/items`), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
      console.log('Fetched items for', selectedCategory, ':', items);
      setMenuItems(items);
    }, (error) => {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    });
    return unsubscribe;
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemData = { ...formData, price: parseFloat(formData.price) };
    try {
      if (showModal === 'add') {
        await addDoc(collection(db, `menu/${selectedCategory}/items`), itemData);
        toast.success('Item added!');
      } else if (showModal === 'edit') {
        if (!selectedItem || !selectedItem.docId) {
          throw new Error('No selected item or invalid document ID');
        }
        const docRef = doc(db, `menu/${selectedCategory}/items`, selectedItem.docId);
        console.log('Attempting to update:', `menu/${selectedCategory}/items/${selectedItem.docId}`);
        await updateDoc(docRef, itemData);
        toast.success('Item updated!');
      }
      setShowModal(null);
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(`Error saving item: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, `menu/${selectedCategory}/items`, selectedItem.docId);
      await deleteDoc(docRef);
      toast.success('Item deleted!');
      setShowModal(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(`Error deleting item: ${error.message}`);
    }
  };

  const handleAddCategory = async () => {
    const newCategory = formData.title;
    if (!newCategory) return;
    try {
      await setDoc(doc(db, 'menu', newCategory), { name: newCategory });
      toast.success('Category added!');
      setShowModal(null);
      setFormData({ id: '', title: '', description: '', price: '', image: '' });
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category');
    }
  };

  const openEditModal = (item) => {
    console.log('Selected item to edit:', item);
    setSelectedItem(item);
    setFormData({
      id: item.id || '',
      title: item.title || '',
      description: item.description || '',
      price: item.price || '',
      image: item.image || ''
    });
    setShowModal('edit');
  };

  if (!user) return null;

  return (
    <>
      {/* Inject custom styles */}
      <style>{styles}</style>

      <Container fluid className="mt-5">
        <Row>
          <Col md={2} className="bg-dark text-white p-3">
            <h4>Admin Panel</h4>
            <Button variant="outline-light" className="w-100 mb-2" onClick={() => setShowModal('category')}>
              <FontAwesomeIcon icon={faPlus} /> Add Category
            </Button>
            <Button variant="outline-danger" className="w-100" onClick={() => signOut(auth)}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
            </Button>
          </Col>
          <Col md={10} className="p-4">
            <div className="d-flex justify-content-between mb-4">
              <div>
                <h2 className="d-inline me-3 text-white">Menu</h2>
                <Dropdown className="d-inline">
                  <Dropdown.Toggle>{selectedCategory || 'Select Category'}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {categories.map(cat => (
                      <Dropdown.Item key={cat.id} onClick={() => setSelectedCategory(cat.id)}>
                        {cat.id}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <Button onClick={() => { setFormData({ id: '', title: '', description: '', price: '', image: '' }); setShowModal('add'); }}>
                <FontAwesomeIcon icon={faPlus} /> Add Item
              </Button>
            </div>

            <Row>
              {menuItems.map(item => (
                <Col md={4} key={item.docId} className="mb-4">
                  <Card>
                    <Card.Img 
                      variant="top" 
                      src={item.image || 'https://via.placeholder.com/180'} // Updated placeholder to match size
                      onError={(e) => e.target.src = 'https://via.placeholder.com/180'} 
                      className="menu-card-img" // Apply custom class for styling
                    />
                    <Card.Body className="card-body">
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                      <Card.Text>${Number(item.price).toFixed(2)}</Card.Text>
                      <Button 
                        variant="outline-warning" 
                        size="sm" 
                        onClick={() => openEditModal(item)}
                        className="me-2" // Add spacing between buttons
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => { setSelectedItem(item); setShowModal('delete'); }}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <Modal show={!!showModal} onHide={() => setShowModal(null)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {showModal === 'add' ? 'Add Item' : showModal === 'edit' ? 'Edit Item' : showModal === 'delete' ? 'Confirm Delete' : 'Add Category'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(showModal === 'add' || showModal === 'edit') && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
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
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control 
                    name="image" 
                    value={formData.image} 
                    onChange={e => setFormData({ ...formData, image: e.target.value })} 
                  />
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="modal-image-preview" // Apply custom class for styling
                      onError={(e) => e.target.src = 'https://via.placeholder.com/120'} // Updated placeholder
                    />
                  )}
                </Form.Group>
                <Button type="submit">{showModal === 'add' ? 'Add' : 'Save'}</Button>
              </Form>
            )}
            {showModal === 'delete' && (
              <p>Are you sure you want to delete "{selectedItem?.title}"?</p>
            )}
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
      </Container>
    </>
  );
}

export default AdminPanel;