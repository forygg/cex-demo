import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import HomePage from './pages/Home';
import Profile from './pages/Profile';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Wallets from './pages/Wallets';
import Orders from './pages/Orders';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wallets" element={<Wallets/>} />
          <Route path="/orders" element={<Orders/>} />
        </Routes>
      </AuthProvider> 
    </Router>
  );
}

export default App;
