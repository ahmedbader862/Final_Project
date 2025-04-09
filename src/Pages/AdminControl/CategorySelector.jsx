import React from 'react';
import { Dropdown } from 'react-bootstrap';

const CategorySelector = ({ categories, selectedCategory, setSelectedCategory }) => (
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
  </div>
);

export default CategorySelector;