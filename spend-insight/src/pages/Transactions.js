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
import { VictoryBar, VictoryChart, VictoryAxis, VictoryPie, VictoryTooltip, VictoryLabel, VictoryContainer } from 'victory';

const Transactions = () => {
  const [showModal, setShowModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [income, setIncome] = useState({
    date: new Date(),
    amount: '',
    notes: '',
  });
  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyBalance, setMonthlyBalance] = useState(0);
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
  const incomeAmounts = monthlyIncomes.map(item => item.amount);
  const transactionAmounts = transactions.map(item => item.amount);
  const transactionCategories = transactions.map(item => item.category);

  // const data = [
  //   { x: 'Income', y: incomeAmounts.reduce((a, b) => a + b, 0) },
  //   { x: 'Expenses', y: transactionAmounts.reduce((a, b) => a + b, 0) },
  // ];
  const calculateCategoryTotals = () => {
    const categoryTotals = {};
    let total = 0;
    transactions.forEach((transaction) => {
      const { category, amount } = transaction;
      if (category in categoryTotals) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
      total += amount;
    });

    const data = Object.entries(categoryTotals).map(([category, amount]) => ({
      x: category,
      y: amount,
      percent: total !== 0 ? (amount / total) * 100 : 0,
    }));

    return data;
  };

  const calculateLabelTotals = () => {
    const labelTotals = {};
    transactions.forEach((transaction) => {
      const { label, amount } = transaction;
      if (label in labelTotals) {
        labelTotals[label] += amount;
      } else {
        labelTotals[label] = amount;
      }
    });
    return labelTotals;
  };

  const data = calculateCategoryTotals();
  const labelTotals = calculateLabelTotals();

  const colorScale = [
    // '#E1FFA0',
    '#FFD4A0',
    '#BDFFA0',
    '#A0FFEE',
    '#AEA7FF',
    '#FFA7F2',
    '#A7D6FF',
    '#FFBFA7',
    '#FFA7D7',
    '#989BD1',
    '#696B94',
    '#1C2169',
    '#BB5A63',
    '#5ABB66',

    // Add more colors here for additional categories
  ];

  const PieChart = ({ data }) => {
    return (
      <VictoryPie
        height={280}
        width={280}
        innerRadius={50}
        data={data}
        colorScale={colorScale}
        labelComponent={
          <VictoryLabel
            style={{ fontSize: 9 }} // Set the desired font size here
            text={({ datum }) => `${datum.x}\n${datum.percent.toFixed(2)}%\n${datum.y}`}
            renderInPortal
          />
        }
      />
    )
  }

  useEffect(() => {
    fetchCategories();
    fetchLabels();
    fetchMonthlyIncome();
    calculateMonthlyIncome();
  }, []);

  useEffect(() => {
    fetchTransactions(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    calculateTotalExpense();
  }, [transactions]);

  useEffect(() => {
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
  }, [transactions]);

  useEffect(() => {
    calculateMonthlyIncome();
  }, [monthlyIncomes]);


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
    toggleCalendarVisibility();
  };

  const toggleCalendarVisibility = () => {
    setCalendarVisible(!isCalendarVisible);
  };


  //handle API
  const fetchTransactions = async (selectedMonth) => {
    try {
      const response = await api.Transaction.listByMonth(userId, selectedMonth);
      if (response.status === 200) {
        setTransactions(response.data.transactions);
        setMonthlyBalance(response.data.savings);
        setMonthlyIncomes(response.data.incomes);
        setTotalIncome(response.data.balance);
      }
    } catch (error) {
      console.error("status: ", error?.response?.status, "error text: ", error?.response?.data?.error);
      console.error(error);
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

  // Fetch all labels
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

  // Fetch income
  const fetchMonthlyIncome = async () => {
    try {
      const response = await api.Income.fetch("auth0|649a8bf297157d2a7b57e432", selectedMonth);
      if (response.status === 200) {
        setMonthlyIncomes(response.data.income);
        setMonthlyBalance(response.data.savings);
        setTotalIncome(response.data.balance);
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
    try {
      const response = await api.Income.insert({ userId: userId, income: newIncome });
      if (response.status === 200) {
        setIncome({
          date: new Date(),
          amount: '',
          notes: '',
        });
        setShowIncomeModal(false);
        fetchMonthlyIncome();
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


  // Calculate balance
  const calculateMonthlyIncome = () => {
    let tempIncome = 0;
    monthlyIncomes.forEach(income => {
      tempIncome += income.amount;
    });
    setMonthlyIncome(tempIncome);
  }

  // Group transactions by date
  const groupedTransactions = groupBy(transactions, (transaction) =>
    format(new Date(transaction.date), 'dd MMM yy')
  );


  // Calculate total expense
  const calculateTotalExpense = () => {
    let tempExpense = 0;
    transactions.forEach(t1 => tempExpense += t1.amount);
    setTotalExpense(tempExpense);
    setCurrentMonthSummary(prevData => ({
      ...prevData,
      Expenses: tempExpense
    }));
  }


  return (
    <div className='container transactions-container'>
      <h1>Transactions</h1>
      <Row className='mb-4'>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Total Balance</Card.Title>
              <Card.Text className={totalIncome > 0 ? 'text-success' : 'text-danger'}>{totalIncome}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Monthly Balance</Card.Title>
              <Card.Text className={monthlyBalance > 0 ? 'text-success' : 'text-danger'}>{monthlyBalance}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Monthly Income</Card.Title>
              <Card.Text className={monthlyIncome > 0 ? 'text-success' : 'text-danger'}>{monthlyIncome}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Monthly Expenses</Card.Title>
              <Card.Text className='text-danger'>{totalExpense}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button variant="secondary" className="my-4" onClick={() => setShowModal(true)}>
        Add Transaction
      </Button>
      <Button variant="secondary" className="m-4" onClick={() => setShowIncomeModal(true)}>
        Add Income
      </Button>
      <Button variant="secondary" className='my-4' onClick={toggleCalendarVisibility}>
        {`${selectedMonth.toLocaleString('default', { month: 'long' })}  ${selectedMonth.getFullYear()}`}
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

      <Row>
        <Col>
          <PieChart data={data} />
        </Col>
        <Col className='d-flex align-items-center'>
          <div className=''>
            {
              Object.entries(labelTotals).map(([key, value]) => <div className="label-wise-data-row">{key} : {value}</div>)
            }
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Transactions;
