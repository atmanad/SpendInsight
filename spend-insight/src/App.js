import {Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import UserDetails from './pages/UserDetails';
import Footer from './components/Footer';
import Header from './components/Header';
import CategoryManagement from './pages/CategoryManagement';
import LabelManagement from './pages/LabelManagement';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from './store/authSlice';
import api from './api/api';
import 'react-loading-skeleton/dist/skeleton.css'
import Dashboard from './pages/Dashboard';
import './App.css'


const App = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(authActions.login(user))
    } else {
      dispatch(authActions.logout())
    }
  }, [isAuthenticated]);

  return (
    <div className='app-container'>
      <Header isAuthenticated={isAuthenticated} user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transactions" element={<Transactions user={user} />} />
        <Route path="/user" element={<UserDetails/>} />
        <Route exact path="/categories" element={<CategoryManagement user={user} />} />
        <Route exact path="/labels" element={<LabelManagement user={user} />} />
        <Route exact path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
