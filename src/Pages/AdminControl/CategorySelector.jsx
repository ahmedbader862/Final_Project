import React from "react";
import { Dropdown, Button } from "react-bootstrap";

const CategorySelector = ({ categories, selectedCategory, setSelectedCategory, setShowModal, setFormData }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div className="d-flex align-items-center gap-3">
        <h2 className="d-inline me-3 text-white">Menu Management</h2>
        <Dropdown>
          <Dropdown.Toggle variant="outline-light" id="categoryDropdown">
            {categories.find(cat => cat.id === selectedCategory)?.name || selectedCategory || "Select Category"}
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-dark">
            {categories.map(cat => (
              <Dropdown.Item key={cat.id} onClick={() => setSelectedCategory(cat.id)}>
                {cat.name || cat.id} {cat.category_ar && `(${cat.category_ar})`}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {/* <Button
        variant="success"
        onClick={() => {
          setFormData({ title: "", description: "", desc_ar: "", category: "", category_ar: "", price: "", image: "", imageFile: null });
          setShowModal("addCategory");
        }}
      >
        Add Category
      </Button> */}
    </div>
  );
};

export default CategorySelector;