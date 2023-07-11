import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import api from '../api/api';

const LabelManagement = () => {
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');

  const fetchLabels = async () => {
    try {
      const response = await api.Label.list("auth0|649a8bf297157d2a7b57e432");
      if (response.status === 200) {
        setLabels(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  const handleAddLabel = async () => {
    try {
      if (!newLabel) {
        alert('Please enter a label name');
        return;
      }

      const response = await api.Label.insert({  userId: "auth0|649a8bf297157d2a7b57e432",labelName: newLabel });
      if (response.status === 200) {
        setNewLabel('');
        fetchLabels();
      }
    } catch (error) {
      console.error("status: ",error.response.status, "error text: ", error.response.data.error);
        }
  };

  const handleDeleteLabel = async (labelId) => {
    try {
      const response = await api.Label.delete({ userId: "auth0|649a8bf297157d2a7b57e432", labelId:labelId});
      if (response.status === 200) {
        fetchLabels();
      }
    } catch (error) {
      console.error("status: ",error.response.status, "error text: ", error.response.data.error);
        }
  };

  return (
    <div className="container">
      <h1>Label Management</h1>

      <Form className="mb-3">
        <Form.Group controlId="labelName">
          <Form.Label>New Label</Form.Label>
          <Form.Control
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddLabel}>
          Add Label
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Label Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label) => (
            <tr key={label._id}>
              <td>{label.labelName}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteLabel(label._id)}
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

export default LabelManagement;
