import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TransactionItem from '../components/TransactionItem.js';

const Transactions = () => {
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const transactions = [
    { id: 1, category: 'Groceries', date: '2023-06-15', amount: 50, notes: 'Bought groceries for the week.' },
    { id: 2, category: 'Dining', date: '2023-06-14', amount: 30, notes: 'Had dinner with friends.' },
    // Add more transactions as needed
  ];

  const handleAddTransaction = () => {
    // Implement the logic to add a transaction
    console.log('Add transaction:', category, date, amount, notes);

    // Clear the form fields
    setCategory('');
    setDate(new Date());
    setAmount('');
    setNotes('');

    // Close the modal
    setShowModal(false);
  };

  return (
    <div className='container'>
      <h1>Transactions</h1>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Total Balance</Card.Title>
              <Card.Text>$1000</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Total Expense of the Month</Card.Title>
              <Card.Text>$500</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button variant="primary" className="mt-4" onClick={() => setShowModal(true)}>
        Add Transaction
      </Button>
      <div>

      {/* Display individual transactions */}
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          category={transaction.category}
          date={transaction.date}
          amount={transaction.amount}
          notes={transaction.notes}
        />
      ))}

      {/* Add Transaction button and modal */}
      {/* ... */}
    </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="groceries">Groceries</option>
                <option value="dining">Dining</option>
                <option value="shopping">Shopping</option>
                {/* Add more categories as needed */}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <br />
              <DatePicker selected={date} onChange={(newDate) => setDate(newDate)} className="form-control" />
            </Form.Group>

            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="notes">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTransaction}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Transactions;
