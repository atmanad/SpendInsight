import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentMonth, setTransactions } from '../store/transactionSlice';
import { Button, Row, Col, Card, Table } from 'react-bootstrap';
import { RiArrowLeftFill, RiArrowRightFill } from 'react-icons/ri';
import DatePicker from 'react-datepicker';
import { VictoryPie, VictoryLabel, Log, LineSegment } from 'victory';
import api from '../api/api';


const Dashboard = ({ user }) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyBalance, setMonthlyBalance] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transaction.transactions);
  const selectedMonth = useSelector(state => state.transaction.selectedMonth);


  // useEffect(() => {
  //   fetchTransactions(selectedMonth);
  // }, [selectedMonth]);

  useEffect(() => {
    if (user !== undefined) {
      fetchTransactions(selectedMonth);
    }
  }, [selectedMonth, user]);

  useEffect(() => {
    calculateTotalExpense();
    calculateMonthlyIncome();
  }, [monthlyIncomes]);


  const calculateLabelTotals = () => {
    const labelTotals = {};
    transactions.forEach((transaction) => {
      const { label, amount } = transaction;
      if (label in labelTotals) {
        labelTotals[label] += amount;
      } else {
        if (label !== '') labelTotals[label] = amount;
      }
    });
    return labelTotals;
  };

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

    data.sort((a, b) => b.y - a.y);

    return data;
  };

  const fetchTransactions = async (selectedMonth) => {
    try {
      const response = await api.Transaction.listByMonth(user?.sub, selectedMonth);
      if (response.status === 200) {
        dispatch(setTransactions(response.data.transactions));
        setMonthlyBalance(response.data.savings);
        setMonthlyIncomes(response.data.incomes);
        setTotalBalance(response.data.balance);
      }
    } catch (error) {
      console.error("status: ", error?.response?.status, "error text: ", error?.response?.data?.error);
      console.error(error);
    }
  };

  const calculateTotalExpense = () => {
    console.log("calculate total expense");
    let tempExpense = 0;
    transactions.forEach(t1 => tempExpense += t1.amount);
    setTotalExpense(tempExpense);
  }

  const calculateMonthlyIncome = () => {
    console.log("calculate monthly income");
    let tempIncome = 0;
    monthlyIncomes.forEach(income => {
      tempIncome += income.amount;
    });
    setMonthlyIncome(tempIncome);
  }

  const data = calculateCategoryTotals();
  const labelTotals = calculateLabelTotals();

  const colorScale = [
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
        innerRadius={100}
        data={data}
        colorScale={colorScale}
        labelIndicator
        // labelRadius={({ radius }) =>  (Math.floor(Math.random() * 10 ) + 10) * 5}
        radius={({ datum }) => (Math.floor(Math.random() * 10) + 5) * 5}
        labelComponent={
          <VictoryLabel
            style={{ fontSize: 5 }} // Set the desired font size here
            text={({ datum }) => `${datum.x}\n${datum.y}`} //{({ datum }) => `${datum.x}\n${datum.percent.toFixed(2)}%\n${datum.y}`}
            renderInPortal
          />
        }
      />
    )
  }


  const toggleCalendarVisibility = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  const handleMonthChange = (date) => {
    dispatch(setCurrentMonth(date));
    toggleCalendarVisibility();
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setDate(1);
    nextMonth.setMonth(nextMonth.getUTCMonth() + 1);
    dispatch(setCurrentMonth(nextMonth));
  }

  const goToPreviousMonth = () => {
    const previousMonth = new Date(selectedMonth);
    previousMonth.setDate(1);
    previousMonth.setMonth(previousMonth.getUTCMonth() - 1);
    dispatch(setCurrentMonth(previousMonth));
  }

  return (
    <div className='container'>
      <h2>Dashboard</h2>
      <div>
        <Row className='mb-4'>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Total Balance</Card.Title>
                <Card.Text className={totalBalance > 0 ? 'text-success' : 'text-danger'}>{totalBalance}</Card.Text>
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
      </div>
      <div className='text-center'>
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

      <Row>
        <Col xs={12} md={7}>
          {/* <PieChart data={data} /> */}
          {
            data.length !== 0 &&
            <Table hover bordered>
              <thead>
                <tr>
                  <th className='row-left'>Category</th>
                  <th className='text-center'>%</th>
                  <th className='row-right'>Amount</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.entries(data).map(([key, value]) => (
                    <tr key={key}>
                      <td className='row-left'>{value.x}</td>
                      <td className='text-center'>{value.percent.toFixed(2)}</td>
                      <td className='row-right'>{value.y}</td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          }
        </Col>
        <Col xs={12} md={5} className='label-wise-data-container'>
          {
            Object.keys(labelTotals).length !== 0 &&
            <Table bordered hover>
              <thead>
                <tr>
                  <th className='row-left'>Label</th>
                  <th className='row-right'>Amount</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.entries(labelTotals).map(([key, value]) => (
                    <tr key={key}>
                      <td className='row-left'>{key}</td>
                      <td className='row-right'>{value}</td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          }
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;