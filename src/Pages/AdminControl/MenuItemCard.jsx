import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const MenuItemCard = ({ item, openEditModal, setSelectedItem, setShowModal }) => (
  <Col md={4} className="mb-4">
    <Card>
      <Card.Img 
        variant="top" 
        src={item.image || 'https://via.placeholder.com/180'} 
        onError={(e) => e.target.src = 'https://via.placeholder.com/180'} 
        className="menu-card-img" 
      />
      <Card.Body className="card-body">
        <Card.Title>{item.title}</Card.Title>
        <Card.Text>{item.description}</Card.Text>
        <Card.Text>${Number(item.price).toFixed(2)}</Card.Text>
        <Button 
          variant="outline-warning" 
          size="sm" 
          onClick={() => openEditModal(item)}
          className="me-2"
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
);

export default MenuItemCard;