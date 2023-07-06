import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { groupBy } from 'lodash';
import api from '../api/api';
import TransactionItem from '../components/TransactionItem.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const Transactions = () => {
  const [showModal, setShowModal] = useState(false);
  const [transaction, setTransaction] = useState({
    category: '',
    date: new Date(),
    amount: '',
    notes: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isCalendarVisible, setCalendarVisible] = useState(false);


  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [selectedMonth]);


  //handleChange
  const handleChange = (event) => {
    setTransaction({ ...transaction, [event.target.name]: event.target.value });
  };

  const handleDateChange = (date) => {
    setTransaction({ ...transaction, date: date });
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    fetchTransactions();
    toggleCalendarVisibility();
  };

  const toggleCalendarVisibility = () => {
    setCalendarVisible(!isCalendarVisible);
    console.log(selectedMonth)
  };



  //handle API
  const fetchTransactions = async () => {
    try {
      const firstDayOfMonth = startOfMonth(selectedMonth);
      const lastDayOfMonth = endOfMonth(selectedMonth);
      // Format the dates to send in the API request
      // const startDate = format(firstDayOfMonth, 'yyyy-MM-dd');
      // const endDate = format(lastDayOfMonth, 'yyyy-MM-dd');
      // console.log(firstDayOfMonth, lastDayOfMonth, startDate, endDate);
      // console.log(new Date(endDate));

      const response = await api.Transaction.listByMonth(firstDayOfMonth, lastDayOfMonth);
      console.log(response);
      if (response.status === 200) {
        setTransactions(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.Category.list();
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTransaction = async () => {
    if (!transaction.category || !transaction.amount) {
      alert('Please select a category and enter an amount');
      return;
    }
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
        setTransaction({
          category: '',
          date: new Date(),
          amount: '',
          notes: ''
        });

        setShowModal(false);
        fetchTransactions();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const groupedTransactions = groupBy(transactions, (transaction) =>
    format(new Date(transaction.Date), 'dd MMM yy')
  );


  console.log(groupedTransactions);

  return (
    <div className='container transactions-container'>
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

      <Button variant="secondary" className="mt-4 mr-4" onClick={() => setShowModal(true)}>
        Add Transaction
      </Button>
      {/* <Button variant="primary" className="mt-4" onClick={() => fetchTransactions(true)}>
        Fetch Transactions
      </Button> */}

      <Button variant="secondary" className='ml-4 mt-4' onClick={toggleCalendarVisibility}>
        Select Month
      </Button>
      <div className="calendar">
        {isCalendarVisible && (
          <DatePicker
            selected={selectedMonth}
            onChange={handleMonthChange}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="form-control"
          />
        )}
      </div>


      <div>
        {Object.keys(groupedTransactions).map((date) => (
          <div key={date} className="transactions-group container">
            <h4>{date}</h4>
            {groupedTransactions[date].map((transaction) => (
              <TransactionItem
                key={transaction.ID}
                category={transaction.Category}
                amount={transaction.Amount}
                notes={transaction.Notes}
                id={transaction.ID}
                fetchTransactions={fetchTransactions}
              />
            ))}
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onChange={handleChange}>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name='category' value={transaction.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.CategoryID} value={category.CategoryName}>{category.CategoryName}</option>
                ))}
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
