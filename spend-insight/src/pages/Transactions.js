import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { format } from 'date-fns';
import api from '../api/api'
import TransactionItem from '../components/TransactionItem.js';

const Transactions = () => {
  const [showModal, setShowModal] = useState(false);
  const [transaction, setTransaction] = useState({
    category: '',
    date: new Date(),
    amount: '',
    notes: ''
  });
  const [transactions, setTransactions] = useState([])

  // To update a specific property in the transaction object, use the spread operator
  const handleChange = (event) => {
    setTransaction({ ...transaction, [event.target.name]: event.target.value });
  };
  const handleDateChange = (date) => {
    setTransaction({ ...transaction, date: date });
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.Transaction.list();
      console.log(response);
      if(response.status === 200){
        setTransactions(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddTransaction = async () => {
    // Validate the required fields
    if (!transaction.category || !transaction.amount) {
      alert('Please select a category and enter an amount');
      return;
    }
    // Create a new transaction object with the submitted data
    const newTransaction = {
      category: transaction.category,
      date: transaction.date.toISOString().substring(0, 10),
      amount: transaction.amount,
      notes: transaction.notes
    };

    console.log(newTransaction);
    try {
      const response = await api.Transaction.insert(newTransaction);
      console.log(response);
      if (response.status === 200) {
        // Clear the form fields
        setTransaction({
          category: '',
          date: new Date(),
          amount: '',
          notes: ''
        });

        // Close the modal 
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
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
      <Button variant="primary" className="mt-4" onClick={() => fetchTransactions(true)}>
        Fetch Transactions
      </Button>
      <div>

        {/* Display individual transactions */}
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.ID}
            category={transaction.Category}
            date={format(new Date(transaction.Date), 'dd MMM yy')}
            amount={transaction.Amount}
            notes={transaction.Notes}
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
          <Form onChange={handleChange}>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name='category'>
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
              <DatePicker selected={transaction.date} name='date' dateFormat="dd/MM/yyyy" onChange={handleDateChange} className="form-control" />
            </Form.Group>

            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" name='amount' />
            </Form.Group>

            <Form.Group controlId="notes">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" name='notes' />
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
