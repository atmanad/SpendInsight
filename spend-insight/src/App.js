import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import LoginPage from './pages/Login';
import UserDetails from './pages/UserDetails';
import Footer from './components/Footer';
import Header from './components/Header';
import CategoryManagement from './pages/CategoryManagement';
import LabelManagement from './pages/LabelManagement';

const App = () => {
  return (
    <div>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user" element={<UserDetails />} />
          <Route exact path="/categories" element={<CategoryManagement/>} />
          <Route exact path="/labels" element={<LabelManagement/>} />
        </Routes>
      <Footer />
    </div>
  );
};

export default App;
