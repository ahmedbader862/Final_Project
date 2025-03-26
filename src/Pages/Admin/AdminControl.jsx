import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, doc } from 'firebase/firestore'; // Added doc import
import { Container, Row, Col, Button, Card, Modal, Form, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(null); // 'add', 'edit', 'delete', 'category'
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', poster_path: '' });

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
      setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
        const docRef = doc(db, `menu/${selectedCategory}/items`, selectedItem.id);
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
      const docRef = doc(db, `menu/${selectedCategory}/items`, selectedItem.id);
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
      setFormData({ title: '', description: '', price: '', poster_path: '' });
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category');
    }
  };

  if (!user) return null;

  return (
    <Container fluid className='mt-5'>
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
            <Button onClick={() => { setFormData({ title: '', description: '', price: '', poster_path: '' }); setShowModal('add'); }}>
              <FontAwesomeIcon icon={faPlus} /> Add Item
            </Button>
          </div>

          <Row>
            {menuItems.map(item => (
              <Col md={4} key={item.id} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={item.poster_path || 'https://via.placeholder.com/300x200'} />
                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <Card.Text>${Number(item.price).toFixed(2)}</Card.Text>
                    <Button variant="outline-warning" size="sm" onClick={() => { setSelectedItem(item); setFormData(item); setShowModal('edit'); }}>
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => { setSelectedItem(item); setShowModal('delete'); }}>
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
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" name="price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control name="poster_path" value={formData.poster_path} onChange={e => setFormData({ ...formData, poster_path: e.target.value })} />
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
              <Form.Control value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </Form.Group>
          )}
        </Modal.Body>
        {showModal === 'delete' && <Modal.Footer><Button variant="danger" onClick={handleDelete}>Delete</Button></Modal.Footer>}
        {showModal === 'category' && <Modal.Footer><Button onClick={handleAddCategory}>Add</Button></Modal.Footer>}
      </Modal>
    </Container>
  );
}

export default AdminPanel;