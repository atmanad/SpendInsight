import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './TransactionItem.css';

const TransactionItem = ({ category, date, amount, notes }) => {
  return (
    <div className="transaction-item">
      <div className="transaction-item-row">
        <div className="transaction-item-category">{category}</div>
        <div className="transaction-item-date">{date}</div>
        <div className="transaction-item-notes">{notes}</div>
        <div className="transaction-item-amount">${amount}</div>
      </div>
    </div>
  );
};

export default TransactionItem;
