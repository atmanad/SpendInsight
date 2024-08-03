import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { groupBy } from 'lodash';
import { RiArrowLeftFill, RiArrowRightFill } from 'react-icons/ri';
import api from '../api/api';
import TransactionItem from '../components/TransactionItem.js';
import 'react-calendar/dist/Calendar.css';
import { VictoryPie, VictoryLabel, Log } from 'victory';
import Skeleton from 'react-loading-skeleton';
import IncomeItem from '../components/IncomeItem';
import { useDispatch, useSelector } from 'react-redux';
import { transactionActions } from '../store/transactionSlice';
import { setTransactions, setCurrentMonth, setBalance } from '../store/transactionSlice';


const Transactions = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [income, setIncome] = useState({
    date: new Date(),
    amount: '',
    notes: '',
    category: ''
  });
  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  // const [totalIncome, setTotalIncome] = useState(0);
  const totalIncome = useSelector(state => state.transaction.balance);
  const [monthlyBalance, setMonthlyBalance] = useState(0);
  const [transaction, setTransaction] = useState({
    category: '',
    date: new Date(),
    amount: '',
    notes: '',
    label: ''
  });
  // const [transactions, setTransactions] = useState([]);
  const transactions = useSelector(state => state.transaction.transactions);
  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const selectedMonth = useSelector(state => state.transaction.selectedMonth);
  // const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [totalExpense, setTotalExpense] = useState(0);
  // const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [groupedItems, setGroupedItems] = useState({});
  const [groupedSortedTransactions, setGroupedSortedTransactions] = useState({});
  const [groupedSortedIncomes, setGroupedSortedIncomes] = useState({});
  const dispatch = useDispatch();


  //useEffects
  useEffect(() => {
    fetchCategories();
    fetchLabels();
    calculateMonthlyIncome();
  }, []);

  useEffect(() => {
    if (user !== undefined) {
      fetchTransactions(selectedMonth);
      fetchMonthlyIncome(selectedMonth);
    }
  }, [selectedMonth, user]);

  useEffect(() => {
    calculateTotalExpense();
  }, [transactions]);

  // useEffect(() => {
  //   const currentDate = new Date();
  //   // Get the current month and year
  //   const currentMonth = selectedMonth.getMonth() + 1; // Months are zero-based, so add 1
  //   const currentYear = selectedMonth.getFullYear();

  //   // Get the previous month and year
  //   const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  //   const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  // }, [transactions]);

  useEffect(() => {
    calculateMonthlyIncome();
  }, [monthlyIncomes]);

  // useEffect(() => {
  //   groupByDate();
  // }, [monthlyIncomes, transactions]);


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
    // setSelectedMonth(date);
    dispatch(transactionActions.setCurrentMonth(date));
    toggleCalendarVisibility();
  };

  const toggleCalendarVisibility = () => {
    setCalendarVisible(!isCalendarVisible);
  };


  //handle API
  const fetchTransactions = async (selectedMonth) => {
    console.log("fetch transactions called");
    setIsLoading(true);
    try {
      const response = await api.Transaction.listByMonth(user?.sub, selectedMonth);
      if (response.status === 200) {
        // setTransactions(response.data.transactions);
        dispatch(setTransactions(response.data.transactions));
        groupAndSortByDate(response.data.transactions, setGroupedSortedTransactions);
        setMonthlyBalance(response.data.savings);
        setMonthlyIncomes(response.data.incomes);
        groupAndSortByDate(response.data.incomes, setGroupedSortedIncomes);
        dispatch(setBalance(response.data.balance));
        // setTotalIncome(response.data.balance);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("status: ", error?.response?.status, "error text: ", error?.response?.data?.error);
      console.error(error);
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.Category.list(user?.sub);
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
      const response = await api.Label.list(user?.sub);
      if (response.status === 200) {
        setLabels(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch income
  const fetchMonthlyIncome = async (selectedMonth) => {
    try {
      console.log("fetch monthly income called");
      const response = await api.Income.fetch(user?.sub, selectedMonth);
      if (response.status === 200) {
        setMonthlyIncomes(response.data.income);
        groupAndSortByDate(response.data.income, setGroupedSortedIncomes);
        setMonthlyBalance(response.data.savings);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Add Income
  const handleAddIncome = async () => {
    if (!income.amount || !income.category) {
      alert('Please enter an amount and note');
      return;
    }
    setSubmitting(true);
    const newIncome = {
      date: income.date.toISOString().substring(0, 10),
      amount: income.amount,
      notes: income.notes,
      category: income.category
    };
    try {
      const response = await api.Income.insert({ userId: user.sub, income: newIncome });
      if (response.status === 200) {
        setIncome({
          date: new Date(),
          amount: '',
          notes: '',
          category: ''
        });
        setShowIncomeModal(false);
        fetchMonthlyIncome(selectedMonth);
        setSubmitting(false);
      }
    } catch (error) {
      console.error("status: ", error.response.status, "error text: ", error.response.data.error);
      setSubmitting(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission behavior
      handleAddTransaction(); // Call the handleAddTransaction function
    }
  };

  // Add Transaction
  const handleAddTransaction = async () => {
    if (!transaction.category || !transaction.amount) {
      alert('Please select a category and enter an amount');
      return;
    }
    setSubmitting(true);
    const newTransaction = {
      category: transaction.category,
      date: transaction.date.toISOString().substring(0, 10),
      amount: transaction.amount,
      notes: transaction.notes,
      label: transaction.label
    };
    try {
      const response = await api.Transaction.insert({ userId: user.sub, transaction: newTransaction });
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
        setSubmitting(false);
      }
    } catch (error) {
      console.error("status: ", error.response.status, "error text: ", error.response.data.error);
      setSubmitting(false);
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

  // Group transactions by date and sort
  const groupedTransactions = groupBy(transactions, (transaction) => format(new Date(transaction.date), 'dd MMM yy'));
  const sortedGroupedTransactions = Object.entries(groupedTransactions).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  const sortedGroupedTransactionsObject = Object.fromEntries(sortedGroupedTransactions);

  const groupedIncomes = groupBy(monthlyIncomes, (income) => format(new Date(income.date), 'dd MMM yy'));
  const sortedGroupedIncomes = Object.entries(groupedIncomes).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  const sortedGroupedIncomesObject = Object.fromEntries(sortedGroupedIncomes);

  const groupAndSortByDate = (itemArray, setItemArray) => {
    const groupedItemArray = groupBy(itemArray, (item) => format(new Date(item.date), 'dd MMM yy'));
    const sortedArray = Object.entries(groupedItemArray).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    const sortedArrayObject = Object.fromEntries(sortedArray);
    setItemArray(sortedArrayObject);
  }

  const groupByDate = () => {
    const combinedArray = [...transactions, ...monthlyIncomes];
    const _groupedItems = groupBy(combinedArray, (item) => format(new Date(item.date), 'dd MMM yy'));
    setGroupedItems(_groupedItems);
  }

  // Calculate total expense
  const calculateTotalExpense = () => {
    let tempExpense = 0;
    transactions.forEach(t1 => tempExpense += t1.amount);
    setTotalExpense(tempExpense);
    // setCurrentMonthSummary(prevData => ({
    //   ...prevData,
    //   Expenses: tempExpense
    // }));
  }

  const goToNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setDate(1);
    nextMonth.setMonth(nextMonth.getUTCMonth() + 1);
    // setSelectedMonth(nextMonth);
    dispatch(transactionActions.setCurrentMonth(nextMonth));
  }

  const goToPreviousMonth = () => {
    const previousMonth = new Date(selectedMonth);
    previousMonth.setDate(1);
    previousMonth.setMonth(previousMonth.getUTCMonth() - 1);
    // setSelectedMonth(previousMonth);
    dispatch(transactionActions.setCurrentMonth(previousMonth));
  }


  return (
    <div className='container transactions-container'>
      <h2>Transactions</h2>
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

      <div className='btn-container'>
        <div className='btn-container-left'>
          <Button variant="secondary" className="my-4" onClick={() => setShowModal(true)}>
            Add Transaction
          </Button>
          <Button variant="secondary" className="my-4" onClick={() => setShowIncomeModal(true)}>
            Add Income
          </Button>
        </div>
        <div className='btn-container-right'>
          <Button className='date-button-left' onClick={goToPreviousMonth}>
            <RiArrowLeftFill />
          </Button>
          <Button variant="secondary" className='my-4' onClick={toggleCalendarVisibility}>
            {`${selectedMonth.toLocaleString('default', { month: 'long' })}  ${selectedMonth.getFullYear()}`}
          </Button>
          <Button className='date-button-right' onClick={goToNextMonth}>
            <RiArrowRightFill />
          </Button>
        </div>
      </div>
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
        {Object.keys(groupedSortedIncomes).map((date) => (
          <div key={date} className='items-group'>
            {
              groupedSortedIncomes[date].map((income) => (
                <IncomeItem
                  key={income._id}
                  date={income.date}
                  amount={income.amount}
                  notes={income.notes || "---"}
                  id={income._id}
                  userId={user?.sub}
                  category={income.category}
                  fetchMonthlyIncome={fetchMonthlyIncome}
                  selectedMonth={selectedMonth}
                />
              ))
            }
          </div>
        ))}
      </div>


      {
        isLoading ?
          <div className='items-group'>
            <Skeleton className='skeleton-transaction-date ' />
            <Skeleton className='skeleton-transaction-item' count={3} />
          </div>
          :
          <div>
            {Object.keys(groupedSortedTransactions).map((date) => (
              <div key={date} className="items-group">
                <h6>{date}</h6>
                {groupedSortedTransactions[date].map((transaction) => (
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
                    userId={user.sub}
                  />
                ))}
              </div>
            ))}
          </div>
      }
      {/* Income Modal */}
      <Modal show={showIncomeModal} onHide={() => setShowIncomeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Income</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onChange={handleIncomeChange}>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <DatePicker selected={income.date} name='date' dateFormat="dd/MM/yyyy" onChange={handleIncomeDateChange} className="form-control" />
            </Form.Group>

            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" name='amount' />
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name='category' value={income.category} onChange={handleChange}>
                <option value="">Select Category</option>
                <option value="Salary">Salary</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="notes">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" name='notes' />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowIncomeModal(false)}>
            Cancel
          </Button>
          {
            submitting ? <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className='mr-2'
              />
              Adding Income..
            </Button> :
              <Button variant="primary" onClick={handleAddIncome}>
                Submit
              </Button>
          }

        </Modal.Footer>
      </Modal>
      {/* Add Transaction Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onChange={handleChange} onKeyDown={handleKeyDown}>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name='category' value={transaction.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.categoryName}>{category.categoryName}</option>
                ))}
              </Form.Control>
              {categories.length === 0 && <span className='text-danger m-2'>Please create Categories in the Category section</span>}
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
          {
            submitting ? <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className='mr-2'
              />
              Adding Transaction..
            </Button> :
              <Button variant="primary" onClick={handleAddTransaction}>
                Submit
              </Button>
          }
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Transactions;