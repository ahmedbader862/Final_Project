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
    <>
      <style>
        {`
          .menu-item-card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease-in-out, box-shadow 0.3s ease;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            background-color: ${theme === 'dark' ? '#212529' : '#f8f9fa'};
            color: ${theme === 'dark' ? '#ffffff' : '#212529'};
          }

          .menu-item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }

          .card-img {
            width: 180px;
            height: 180px;
            object-fit: cover;
            border-radius: 50%;
            border: 2px solid #e0e0e0;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin: 15px auto;
            display: block;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .card-img:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }

          .card-body {
            text-align: center;
            padding: 1.5rem;
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .card-text-description {
            font-size: 0.9rem;
            color: ${theme === 'dark' ? '#b0b0b0' : '#6c757d'};
            margin-bottom: 0.75rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .card-text-price {
            font-size: 1rem;
            font-weight: 500;
            color: #ff4d4f;
            margin-bottom: 1rem;
          }

          .button-container {
            margin-top: auto;
            display: flex;
            justify-content: center;
            gap: 0.5rem;
          }

          .edit-button, .delete-button {
            font-size: 0.9rem;
            padding: 0.5rem 1.5rem;
            border-radius: 20px;
            transition: background-color 0.3s ease, transform 0.1s ease;
          }

          .edit-button {
            background-color: #4A919E;
            border-color: #4A919E;
          }

          .edit-button:hover {
            background-color: #3A7D8C;
            border-color: #3A7D8C;
            transform: scale(1.05);
          }

          .delete-button {
            background-color: #B73E3E;
            border-color: #B73E3E;
          }

          .delete-button:hover {
            background-color: #9A3434;
            border-color: #9A3434;
            transform: scale(1.05);
          }

          @media (max-width: 768px) {
            .menu-item-card {
              width: 260px;
              min-height: 400px;
            }

            .card-img {
              width: 150px;
              height: 150px;
            }

            .card-body {
              min-height: 180px;
            }

            .card-text-description {
              font-size: 0.85rem;
              -webkit-line-clamp: 2;
            }

            .edit-button, .delete-button {
              font-size: 0.85rem;
              padding: 0.4rem 1.2rem;
            }
          }

          @media (max-width: 576px) {
            .menu-item-card {
              width: 100%;
              max-width: 300px;
              margin: 0 auto;
            }
          }
        `}
      </style>
      <Col xs={12} sm={6} md={4} lg={3} style={{ marginBottom: '1.5rem' }}>
        <Card className="menu-item-card">
          <Card.Img
            variant="top"
            src={item.image || 'https://via.placeholder.com/150'}
            alt={item.title}
            className="card-img"
          />
          <Card.Body className="card-body">
            <Card.Title className="card-title">
              {item.title || 'Untitled'}
            </Card.Title>
            <Card.Text className="card-text-description">
              {item.description || 'No description'}
            </Card.Text>
            <Card.Text className="card-text-price">
              {text?.price || 'Price'}: ${parseFloat(item.price).toFixed(2)}
            </Card.Text>
            <div className="button-container">
              <Button
                variant="primary"
                className="edit-button"
                onClick={() => {
                  console.log('Opening edit modal for item:', item.docId);
                  openEditModal(item);
                }}
              >
                {text?.edit || 'Edit'}
              </Button>
              <Button
                variant="danger"
                className="delete-button"
                onClick={() => {
                  console.log('Opening delete modal for item:', item.docId);
                  setSelectedItem(item);
                  setShowModal('delete');
                }}
              >
                {text?.delete || 'Delete'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default MenuItemCard;