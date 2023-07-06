import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import api from '../api/api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await api.Category.list();
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      if (!newCategory) {
        alert('Please enter a category name');
        return;
      }

      const response = await api.Category.insert({ categoryName: newCategory });
      if (response.status === 200) {
        setNewCategory('');
        fetchCategories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await api.Category.delete(categoryId);
      if (response.status === 200) {
        fetchCategories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>Category Management</h1>

      <Form className="mb-3">
        <Form.Group controlId="categoryName">
          <Form.Label>New Category</Form.Label>
          <Form.Control
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddCategory}>
          Add Category
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.CategoryID}>
              <td>{category.CategoryName}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.CategoryID)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CategoryManagement;
