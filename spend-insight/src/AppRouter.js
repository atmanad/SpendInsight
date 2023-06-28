import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Transactions from './pages/Transactions';
import LoginPage from './pages/Login';
import UserDetails from './pages/UserDetails';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/transactions" element={<Transactions/>} />
        <Route exact path="/login" element={<LoginPage/>} />
        <Route exact path="/user" element={<UserDetails/>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
