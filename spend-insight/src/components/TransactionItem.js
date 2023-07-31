import React, { useState } from 'react';
import './TransactionItem.css';
import { RiDeleteBin2Line } from "react-icons/ri"
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner';
import api from "../api/api"

const TransactionItem = ({ category, date, amount, notes, id, fetchTransactions, label, selectedMonth, userId }) => {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await api.Transaction.delete(userId, id, date);
      if (response.status === 200) {
        console.log('Transaction deleted successfully');
        console.log(selectedMonth);
        fetchTransactions(selectedMonth);
        setDeleting(false);
      }
    } catch (error) {
      console.error(error);
      setDeleting(false);
    }
  }


  return (
    <>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Body>
          <Card>
            <Card.Body>
              Are you sure you want to delete the transaction?
            </Card.Body>
            <Card.Footer>
                <Button variant="primary" className='mr-10' onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                {
                  deleting ? <Button variant="primary" disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className='mr-2'
                    />
                    Deleting...
                  </Button> :
                    <Button variant="danger" onClick={handleDelete}>
                      Delete
                    </Button>
                }
            </Card.Footer>
          </Card>
        </Modal.Body>
      </Modal>
      <div className="transaction-item">
        <div className="transaction-item-row">
          <div className="transaction-item-category">{category}</div>
          <div className="transaction-item-label">{label}</div>
          {/* <div className="transaction-item-date">{date}</div> */}
          <div className="transaction-item-notes">{notes}</div>
          <div className="transaction-item-amount">{amount}</div>
          <button className="transaction-item-button pb-1" onClick={() => setShowDeleteModal(true)}>
            <RiDeleteBin2Line />
          </button>
        </div>
      </div>
    </>
  );
};

export default TransactionItem;
