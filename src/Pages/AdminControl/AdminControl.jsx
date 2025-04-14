import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Container, Row, Col, Button } from 'react-bootstrap'; // Added Col to imports
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import CategorySelector from './CategorySelector';
import MenuItemCard from './MenuItemCard';
import ItemModal from './ItemModal';
import './AdminPanel.css';

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ id: '', title: '', description: '', price: '', image: '', imageFile: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
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
      setMenuItems(items);
    }, (error) => {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    });
    return unsubscribe;
  }, [selectedCategory]);

  const uploadImageToStorage = async (file) => {
    if (!file) return null;
    try {
      const sanitizedFileName = file.name.replace(/\s+/g, '_');
      const storageRef = ref(storage, `menu/${selectedCategory}/items/image/${Date.now()}_${sanitizedFileName}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload image: ${error.message}`);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.image;
    try {
      if (formData.imageFile) imageUrl = await uploadImageToStorage(formData.imageFile);
      const itemData = { 
        id: formData.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        image: imageUrl || '',
      };
      if (showModal === 'add') {
        await addDoc(collection(db, `menu/${selectedCategory}/items`), itemData);
        toast.success('Item added!');
      } else if (showModal === 'edit') {
        const docRef = doc(db, `menu/${selectedCategory}/items`, selectedItem.docId);
        await updateDoc(docRef, itemData);
        toast.success('Item updated!');
      }
      setShowModal(null);
      setFormData({ id: '', title: '', description: '', price: '', image: '', imageFile: null });
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
      setFormData({ id: '', title: '', description: '', price: '', image: '', imageFile: null });
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category');
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      id: item.id || '',
      title: item.title || '',
      description: item.description || '',
      price: item.price || '',
      image: item.image || '',
      imageFile: null
    });
    setShowModal('edit');
  };

  if (!user) return null;

  return (
    <>
      
      <Container fluid className="mt-5">
        <Row>
          <Sidebar setShowModal={setShowModal} />
          <Col md={10} className="p-4"> {/* Line 181-ish where Col is used */}
            <CategorySelector 
              categories={categories} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
            />
            <Button 
              onClick={() => { setFormData({ id: '', title: '', description: '', price: '', image: '', imageFile: null }); setShowModal('add'); }}
              className="mb-4"
            >
              Add Item
            </Button>
            <Row>
              {menuItems.map(item => (
                <MenuItemCard 
                  key={item.docId} 
                  item={item} 
                  openEditModal={openEditModal} 
                  setSelectedItem={setSelectedItem} 
                  setShowModal={setShowModal} 
                />
              ))}
            </Row>
          </Col>
        </Row>
        <ItemModal 
          showModal={showModal} 
          setShowModal={setShowModal} 
          formData={formData} 
          setFormData={setFormData} 
          handleSubmit={handleSubmit} 
          handleDelete={handleDelete} 
          handleAddCategory={handleAddCategory} 
          selectedItem={selectedItem} 
        />
      </Container>
    </>
  );
}

export default AdminPanel;