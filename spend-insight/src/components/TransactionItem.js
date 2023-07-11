import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './TransactionItem.css';
import { RiDeleteBin2Line } from "react-icons/ri"
import api from "../api/api"

const TransactionItem = ({ category, date, amount, notes, id, fetchTransactions , label, selectedMonth}) => {
  const userId = "auth0|649a8bf297157d2a7b57e432";
  const handleDelete = async() => {
    try {      
      const response = await api.Transaction.delete(userId, id, date);
      if(response.status === 200){
        console.log('Transaction deleted successfully');
        console.log(selectedMonth);
        fetchTransactions(selectedMonth);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="transaction-item">
      <div className="transaction-item-row">
        <div className="transaction-item-category">{category}</div>
        <div className="transaction-item-label">{label}</div>
        {/* <div className="transaction-item-date">{date}</div> */}
        <div className="transaction-item-notes">{notes}</div>
        <div className="transaction-item-amount">{amount}</div>
        <button className="delete-button pb-1" onClick={handleDelete}>
          <RiDeleteBin2Line />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
