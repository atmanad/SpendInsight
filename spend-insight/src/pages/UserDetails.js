import React, {  useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import {RiEdit2Line } from "react-icons/ri"
import api from '../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/authSlice';

const UserDetail = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const userSub = useSelector(state => state.auth.user);
  console.log(userSub);
  const accessToken = useSelector(state => state.auth.token);
  const userMetadata = useSelector(state => state.auth.userMetadata);
  console.log(accessToken);

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
      const response = await api.User.updateName(userMetadata.user_id, accessToken, {
        "user_metadata": { "name": name }
      });
      dispatch(authActions.updateMetadata({
        index:"user_metadata", name:response?.user_metadata.name
      }))
    } catch (error) {
      console.error(error)
    }

    handleCloseModal();
  };

  return (
    <div className="container mt-4">
      <h2>User Details</h2>
      <div className='row user-details-row'>
        <div className='col-9 user-details-col-left'>
          <div className="card user-details-card">
            <div className="card-body">
              <h5 className="card-title">Name: {userMetadata?.user_metadata?.name}<span className='user-details-edit-button' onClick={handleOpenModal}><RiEdit2Line/></span></h5>
              <h5 className="card-text">Email: {userMetadata?.email}</h5>
            </div>
          </div>
        </div>
        <div className='col-3 user-details-col-right'>
          <img src={userMetadata?.picture} className='img-fluid' alt='user'/>
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
