import React, { useContext } from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../Context/ThemeContext';

const MenuItemCard = ({ item, openEditModal, setSelectedItem, setShowModal }) => {
  const { theme } = useContext(ThemeContext);
  const textColor = theme === 'dark' ? 'text-white' : 'text-dark';
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  console.log('Rendering MenuItemCard for item:', item);

  return (
    <Col md={4} className="mb-4">
      <Card className={`bg-dark text-white`}>
        <Card.Img
          variant="top"
          src={item.image || 'https://via.placeholder.com/150'}
          alt={item.title}
          style={{ height: '150px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title>{item.title || 'Untitled'}</Card.Title>
          <Card.Text>{item.description || 'No description'}</Card.Text>
          <Card.Text>{text?.price || 'Price'}: ${parseFloat(item.price).toFixed(2)}</Card.Text>
          <Button
            variant="primary"
            onClick={() => {
              console.log('Opening edit modal for item:', item.docId);
              openEditModal(item);
            }}
          >
            {text?.edit || 'Edit'}
          </Button>
          <Button
            variant="danger"
            className="mt-2"
            onClick={() => {
              console.log('Opening delete modal for item:', item.docId);
              setSelectedItem(item);
              setShowModal('delete');
            }}
          >
            {text?.delete || 'Delete'}
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default MenuItemCard;