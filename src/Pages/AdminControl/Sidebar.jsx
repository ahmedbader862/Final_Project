import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';

const Sidebar = ({ setShowModal }) => (
  <Col md={2} className="bg-dark text-white p-3">
    <h4>Admin Panel</h4>
    <Button variant="outline-light" className="w-100 mb-2" onClick={() => setShowModal('category')}>
      <FontAwesomeIcon icon={faPlus} /> Add Category
    </Button>
    <Button variant="outline-danger" className="w-100" onClick={() => signOut(auth)}>
      <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
    </Button>
  </Col>
);

export default Sidebar;