import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import api from '../api/api';
import Skeleton from 'react-loading-skeleton';
import Spinner from 'react-bootstrap/Spinner';

const CategoryManagement = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);


  const fetchCategories = async () => {
    try {
      const response = await api.Category.list(user?.sub);
      console.log(response);
      if (response.status === 200) {
        setCategories(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    setButtonLoading(true);
    try {
      if (!newCategory) {
        alert('Please enter a category name');
        setButtonLoading(false);
        return;
      }

      const response = await api.Category.insert({ userId: user?.sub, categoryName: newCategory });
      if (response.status === 200) {
        setNewCategory('');
        fetchCategories();
        setButtonLoading(false);
      }
    } catch (error) {
      console.error("status: ", error.response.status, "error text: ", error.response.data.error);
      setButtonLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      console.log(categoryId);
      const response = await api.Category.delete({ userId: user?.sub, categoryId: categoryId });
      if (response.status === 200) {
        fetchCategories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h2>Category Management</h2>
      <Form className="mb-3">
        <Form.Label>New Category</Form.Label>
        <div className='row'>
          <div className='col'>
            <Form.Control
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          <div className='col-auto'>
            {
              buttonLoading ?
                <Button variant="primary" disabled>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className='mr-2'
                  />
                  Adding Category...
                </Button> 
                :
                <Button variant="primary" onClick={handleAddCategory}>
                  Add Category
                </Button>
            }
          </div>
        </div>
      </Form>
      {
        isLoading ?
          <Skeleton className='skeleton-table-row' count={3} />
          :
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.categoryName}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
      }
    </div>
  );
};

export default CategoryManagement;
