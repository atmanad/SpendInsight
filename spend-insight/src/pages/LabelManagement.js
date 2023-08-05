import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import api from '../api/api';
import Skeleton from 'react-loading-skeleton';
import Spinner from 'react-bootstrap/Spinner';


const LabelManagement = ({ user }) => {
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const fetchLabels = async () => {
    try {
      const response = await api.Label.list(user?.sub);
      if (response.status === 200) {
        setLabels(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  const handleAddLabel = async () => {
    setButtonLoading(true);
    try {
      if (!newLabel) {
        alert('Please enter a label name');
        setButtonLoading(false);
        return;
      }

      const response = await api.Label.insert({ userId: user?.sub, labelName: newLabel });
      if (response.status === 200) {
        setNewLabel('');
        fetchLabels();
        setButtonLoading(false);
      }
    } catch (error) {
      console.error("status: ", error.response.status, "error text: ", error.response.data.error);
      setButtonLoading(false);
    }
  };

  const handleDeleteLabel = async (labelId) => {
    try {
      const response = await api.Label.delete({ userId: user?.sub, labelId: labelId });
      if (response.status === 200) {
        fetchLabels();
      }
    } catch (error) {
      console.error("status: ", error.response.status, "error text: ", error.response.data.error);
    }
  };

  return (
    <div className="container">
      <h2>Label Management</h2>

      <Form className="mb-3">
        <Form.Label>New Label</Form.Label>
        <div className='row'>
          <div className='col'>
            <Form.Control
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </div>
          <div className='col'>
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
                  Adding Label...
                </Button>
                :
                <Button variant="primary" onClick={handleAddLabel}>
                  Add Label
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
      }
    </div>
  );
};

export default LabelManagement;
