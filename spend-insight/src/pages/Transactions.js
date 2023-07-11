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
import 'react-calendar/dist/Calendar.css';


const Transactions = () => {
  const [showModal, setShowModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [income, setIncome] = useState({
    date: new Date(),
    amount: '',
    notes: '',
  });
  const [incomes, setIncomes] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  const [transaction, setTransaction] = useState({
    category: '',
    date: new Date(),
    amount: '',
    notes: '',
    label: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  console.log("Selected Month", selectedMonth);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const userId = "auth0|649a8bf297157d2a7b57e432";
  const [previousMonthSummary, setPreviousMonthSummary] = useState({
    ID: 0,
    Month: 0,
    Year: 0,
    Balance: 0,
    Income: 0,
    Expenses: 0
  });

  const [currentMonthSummary, setCurrentMonthSummary] = useState({
    ID: 0,
    Month: 0,
    Year: 0,
    Balance: 0,
    Income: 0,
    Expenses: 0
  });

  // useEffects


  useEffect(() => {
    fetchCategories();
    fetchLabels();
    fetchIncome();
    calculateTotalIncome();
  }, []);

  useEffect(() => {
    fetchTransactions(selectedMonth);
    console.log(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    calculateTotalExpense();
  }, [transactions]);

  useEffect(() => {
    console.log("total Expense", totalExpense);
    console.log(currentMonthSummary.Expenses);
    if (currentMonthSummary.Month !== 0) {
      // insertMonthlySummary();
    }
  }, [currentMonthSummary.Expenses]);

  useEffect(() => {
    const currentDate = new Date();

    // Get the current month and year
    const currentMonth = selectedMonth.getMonth() + 1; // Months are zero-based, so add 1
    const currentYear = selectedMonth.getFullYear();

    // Get the previous month and year
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    console.log("current month, year", currentMonth, " ", currentYear);
    console.log("previous month, year", previousMonth, " ", previousYear);


    fetchPreviousMonthSummary(previousYear, previousMonth);
    fetchCurrentMonthSummary(currentYear, currentMonth);
  }, [transactions]);

  useEffect(() => {
    console.log("current Month Summary", currentMonthSummary);
  }, [currentMonthSummary]);

  useEffect(() => {
    console.log("previous Month Summary", previousMonthSummary);
  }, [previousMonthSummary]);

  useEffect(() => {
    calculateTotalIncome(0);
  }, [incomes]);


  // handleChange
  const handleChange = (event) => {
    setTransaction({ ...transaction, [event.target.name]: event.target.value });
  };

  const handleDateChange = (date) => {
    setTransaction({ ...transaction, date: date });
  };
  const handleIncomeChange = (event) => {
    setIncome({ ...income, [event.target.name]: event.target.value });
  };
  const handleIncomeDateChange = (date) => {
    setIncome({ ...income, date: date });
  };


  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    fetchTransactions();
    toggleCalendarVisibility();
  };

  const toggleCalendarVisibility = () => {
    setCalendarVisible(!isCalendarVisible);
  };


  //handle API
  const fetchTransactions = async (selectedMonth) => {
    try {
      const response = await api.Transaction.listByMonth(userId, selectedMonth);
      console.log(response);
      if (response.status === 200) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error("status: ", error.response.status, "error text: ", error.response.data.error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.Category.list("auth0|649a8bf297157d2a7b57e432");
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  //fetch income
  const fetchIncome = async () => {
    try {
      const response = await api.Income.fetch("auth0|649a8bf297157d2a7b57e432", selectedMonth);
      if (response.status === 200) {
        console.log((response.data));
        setIncomes(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add Income
  const handleAddIncome = async () => {
    if (!income.amount || !income.notes) {
      alert('Please enter an amount and note');
      return;
    }
    const newIncome = {
      date: income.date.toISOString().substring(0, 10),
      amount: income.amount,
      notes: income.notes,
    };
    console.log(newIncome)
    try {
      const response = await api.Income.insert({ userId: userId, income: newIncome });
      if (response.status === 200) {
        setIncome({
          date: new Date(),
          amount: '',
          notes: '',
        });
        setShowIncomeModal(false);
      fetchIncome();
      }
    } catch (error) {
      console.error("status: ", error.response.status, "error text: ", error.response.data.error);
    }
  };
  // Add Transaction
  const handleAddTransaction = async () => {
    if (!transaction.category || !transaction.amount || !transaction.label) {
      alert('Please select a category, a label and enter an amount');
      return;
    }
    const newTransaction = {
      category: transaction.category,
      date: transaction.date.toISOString().substring(0, 10),
      amount: transaction.amount,
      notes: transaction.notes,
      label: transaction.label
    };
    console.log(newTransaction)
    try {

      const response = await api.Transaction.insert({ userId: userId, transaction: newTransaction });
      if (response.status === 200) {
        setTransaction({
          category: '',
          date: new Date(),
          amount: '',
          notes: '',
          label: ''
        });
        setShowModal(false);
        fetchTransactions(selectedMonth);
      }
    } catch (error) {
      console.error("status: ", error.response.status, "error text: ", error.response.data.error);
    }
  };

  // Fetch monthly summary
  const fetchPreviousMonthSummary = async (year, month) => {
    try {
      const response = await api.Expense.fetch(year, month);
      if (response.status === 200) {
        response.data[0] !== undefined && setPreviousMonthSummary(response.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCurrentMonthSummary = async (year, month) => {
    // console.log(year, month);
    try {
      const response = await api.Expense.fetch(year, month);
      if (response.status === 200) {
        response.data[0] !== undefined && setCurrentMonthSummary(response.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Insert monthly summary
  const insertMonthlySummary = async () => {
    try {
      console.log(currentMonthSummary);
      const response = await api.Expense.insert(currentMonthSummary);
      if (response.status === 200) {
        console.log("inserting monthly summary", response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Calculate balance
  const calculateTotalIncome = () => {
    let tempIncome = 0;
    incomes.forEach(income => {
      tempIncome+=income.amount;
    });
    setTotalIncome(tempIncome);
  }

  // Group transactions by date
  const groupedTransactions = groupBy(transactions, (transaction) =>
    format(new Date(transaction.date), 'dd MMM yy')
  );

  console.log(groupedTransactions);

  // Calculate total expense
  const calculateTotalExpense = () => {
    let tempExpense = 0;
    transactions.forEach(t1 => {
      tempExpense += t1.amount;
    });
    setTotalExpense(tempExpense);
    setCurrentMonthSummary(prevData => ({
      ...prevData,
      Expenses: tempExpense
    }));
  }


  return (
    <div className='container transactions-container'>
      <h1>Transactions</h1>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Total Balance</Card.Title>
              <Card.Text>{totalIncome}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Total Expense of the Month</Card.Title>
              <Card.Text>{totalExpense}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button variant="secondary" className="mt-4 mr-4" onClick={() => setShowModal(true)}>
        Add Transaction
      </Button>
      <Button variant="secondary" className="mt-4 mr-4" onClick={() => setShowIncomeModal(true)}>
        Add Income
      </Button>

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
          <div key={date} className="transactions-group">
            <h6>{date}</h6>
            {groupedTransactions[date].map((transaction) => (
              <TransactionItem
                key={transaction._id}
                category={transaction.category}
                label={transaction.label}
                amount={transaction.amount}
                notes={transaction.notes}
                id={transaction._id}
                fetchTransactions={fetchTransactions}
                selectedMonth={selectedMonth}
                date={transaction.date}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Income Modal */}
      <Modal show={showIncomeModal} onHide={() => setShowIncomeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Income</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onChange={handleIncomeChange}>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <br />
              <DatePicker selected={income.date} name='date' dateFormat="dd/MM/yyyy" onChange={handleIncomeDateChange} className="form-control" />
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
          <Button variant="primary" onClick={handleAddIncome}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add Transaction Modal */}
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
                  <option key={category._id} value={category.categoryName}>{category.categoryName}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="label">
              <Form.Label>Label</Form.Label>
              <Form.Control as="select" name='label' value={transaction.label} onChange={handleChange}>
                <option value="">Select Label</option>
                {labels.map((label) => (
                  <option key={label._id} value={label.labelName}>{label.labelName}</option>
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
