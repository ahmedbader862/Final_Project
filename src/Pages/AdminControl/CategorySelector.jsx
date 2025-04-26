import React, { useContext } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../Context/ThemeContext';

const CategorySelector = ({ categories, selectedCategory, setSelectedCategory, setShowModal, setFormData }) => {
  const { theme } = useContext(ThemeContext);
  const textColor = theme === 'dark' ? 'text-white' : 'text-dark';
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div className="d-flex align-items-center gap-3">
        <h2 className={`d-inline me-3 ${textColor}`}>
          {text?.menuManagement || (currentLange === 'Ar' ? 'إدارة القائمة' : 'Menu Management')}
        </h2>
        <Dropdown>
          <Dropdown.Toggle variant="outline-light" id="categoryDropdown">
            {categories.find(cat => cat.id === selectedCategory)?.name || 
             text?.selectCategory || (currentLange === 'Ar' ? 'اختر فئة' : 'Select Category')}
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-dark">
            {categories.map(cat => (
              <Dropdown.Item
                key={cat.id}
                onClick={() => {
                  console.log('Selecting category:', cat.id);
                  setSelectedCategory(cat.id);
                }}
              >
                {(currentLange === 'Ar' && cat.category_ar) ? cat.category_ar : cat.name || cat.id}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Button
        variant="success"
        onClick={() => {
          console.log('Opening add category modal');
          setFormData({
            title: '',
            title_ar: '',
            name_en: '',
            name_ar: '',
            description: '',
            desc_ar: '',
            category: '',
            category_ar: '',
            price: '',
            image: '',
            imageFile: null,
          });
          setShowModal('addCategory');
        }}
      >
        {text?.addCategory || (currentLange === 'Ar' ? 'إضافة فئة' : 'Add Category')}
      </Button>
    </div>
  );
};

export default CategorySelector;