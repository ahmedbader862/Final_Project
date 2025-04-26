import React from 'react';
import { Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const MenuItemCard = ({ item, openEditModal, setSelectedItem, setShowModal }) => {
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  return (
    <Col md={4} className="mb-4">
      <Card className="bg-dark text-white border-0 shadow h-100">
        <Card.Img
          variant="top"
          src={item.image || 'https://via.placeholder.com/180'}
          onError={(e) => (e.target.src = 'https://via.placeholder.com/180')}
          style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
        />
        <Card.Body>
          <Card.Title>{item.title || 'Unnamed Item'}</Card.Title>
          <Card.Text>
            <strong>{text.titleEn}:</strong> {item.title || 'No title'} <br />
            <strong>{text.titleAr}:</strong> {item.title_ar || 'لا يوجد عنوان'} <br />
            <strong>{text.nameEn}:</strong> {item.name_en || 'No name'} <br />
            <strong>{text.nameAr}:</strong> {item.name_ar || 'لا يوجد اسم'} <br />
            <strong>{text.descriptionEn}:</strong> {item.description || 'No description'} <br />
            <strong>{text.descriptionAr}:</strong> {item.desc_ar || 'لا يوجد وصف'} <br />
            <strong>{text.price}:</strong> ${Number(item.price).toFixed(2)}
          </Card.Text>
          <div className="d-flex gap-2">
            <Button variant="primary" size="sm" onClick={() => openEditModal(item)}>
              <FontAwesomeIcon icon={faEdit} className="me-1" /> {text.edit}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setSelectedItem(item);
                setShowModal('delete');
              }}
            >
              <FontAwesomeIcon icon={faTrash} className="me-1" /> {text.delete}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default MenuItemCard;