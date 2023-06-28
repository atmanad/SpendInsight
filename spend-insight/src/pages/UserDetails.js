import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const UserDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('John Doe');

  const user = {
    user_id: 'auth0|507f1f77bcf86cd799439020',
    email: 'john.doe@gmail.com',
    email_verified: false,
    username: 'johndoe',
    phone_number: '+199999999999999',
    phone_verified: false,
    created_at: '',
    updated_at: '',
    identities: [
      {
        connection: 'Initial-Connection',
        user_id: '507f1f77bcf86cd799439020',
        provider: 'auth0',
        isSocial: false,
      },
    ],
    app_metadata: {},
    user_metadata: {},
    picture: '',
    name: '',
    nickname: '',
    multifactor: [''],
    last_ip: '',
    last_login: '',
    logins_count: 0,
    blocked: false,
    given_name: '',
    family_name: '',
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSave = () => {
    // Perform the save operation or API call to update the user's name
    console.log('Saving name:', name);
    handleCloseModal();
  };

  return (
    <div className="container mt-4">
      <h1>User Details</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Name: {user.name}</h5>
          <p className="card-text">Email: {user.email}</p>
          <p className="card-text">Phone Number: {user.phone_number}</p>
          <Button variant="primary" onClick={handleOpenModal}>
            Edit Name
          </Button>
        </div>
      </div>

      <Modal show={isModalOpen} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={handleNameChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserDetail;
