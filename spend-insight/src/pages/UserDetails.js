import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import api from '../api/api';
import { useSelector } from 'react-redux';

const UserDetail = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('John Doe');
  const [userData, setUserData] = useState({
    name: null, email: null
  });
  const userSub = useSelector(state => state.auth.user);
  console.log(userSub);
  const accessToken = useSelector(state => state.auth.token);
  const userMetadata = useSelector(state => state.auth.userMetadata);
  console.log(accessToken);
  // const getUserMetadata = async () => {
  //   const response = await api.User.fetch(userSub, accessToken);
  //   setUserData(response);
  // }

  // useEffect(() => {
  //   getUserMetadata();
  // }, []);



  // const user = {
  //   user_id: 'auth0|507f1f77bcf86cd799439020',
  //   email: 'john.doe@gmail.com',
  //   email_verified: false,
  //   username: 'johndoe',
  //   phone_number: '+199999999999999',
  //   phone_verified: false,
  //   created_at: '',
  //   updated_at: '',
  //   identities: [
  //     {
  //       connection: 'Initial-Connection',
  //       user_id: '507f1f77bcf86cd799439020',
  //       provider: 'auth0',
  //       isSocial: false,
  //     },
  //   ],
  //   app_metadata: {},
  //   user_metadata: {},
  //   picture: '',
  //   name: '',
  //   nickname: '',
  //   multifactor: [''],
  //   last_ip: '',
  //   last_login: '',
  //   logins_count: 0,
  //   blocked: false,
  //   given_name: '',
  //   family_name: '',
  // };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await api.User.updateName(userMetadata.user_id, accessToken, { 'name': name });
      console.log(response);
    } catch (error) {
      console.error(error)
    }

    handleCloseModal();
  };

  return (
    <div className="container mt-4">
      <h1>User Details</h1>
      <div className='row'>
        <div className='col-9'>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Name: {userMetadata?.name}</h5>
              <p className="card-text">Email: {userMetadata?.email}</p>
              <Button variant="primary" onClick={handleOpenModal}>
                Edit Name
              </Button>
            </div>
          </div>
        </div>
        <div className='col-3'>
          <img src={user?.picture} className='img-fluid' />
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
