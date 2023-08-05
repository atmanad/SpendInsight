import React, { useState } from 'react';
import './components.css';
import { RiDeleteBin2Line } from "react-icons/ri"
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner';
import api from "../api/api"
import { startOfMonth, endOfMonth, format } from 'date-fns';

const IncomeItem = ({ date, amount, notes, id, userId, category , fetchMonthlyIncome, selectedMonth}) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const response = await api.Income.delete(userId, id, date);
            if (response.status === 200) {
                console.log('Income deleted successfully');
                fetchMonthlyIncome(selectedMonth);
                setDeleting(false);
                setShowDeleteModal(false);
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
                            Are you sure you want to delete the income?
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="primary" className='mr-10' onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            {
                                deleting ?
                                    <Button variant="primary" disabled>
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
            <div className="item-row">
                <div className="item-category">{category || "---"}</div>
                <div className="item-date">{format(new Date(date), 'dd MMM')}</div>
                <div className="item-notes">{notes}</div>
                <div className="income-item-amount">+{amount}</div>
                <button className="item-delete-button pb-1" onClick={() => setShowDeleteModal(true)}>
                    <RiDeleteBin2Line />
                </button>
            </div>
        </>
    );
};

export default IncomeItem;
