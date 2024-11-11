// App.js
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import SignIn from './components/SignIn';
import Main from './components/Main';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import ProductSale from './components/ProductSale';
import { getCurrentUser } from './api/Utils';
import { ACCESS_TOKEN } from './constants/constant';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [authState, setAuthState] = React.useState({
    authenticated: false,
    currentUser: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadCurrentlyLoggedInUser();
  }, []);

  const loadCurrentlyLoggedInUser = async () => {
    try {
      const user = await getCurrentUser();
      setAuthState({
        authenticated: true,
        currentUser: user,
      });
    } catch (error) {
      console.error('사용자 정보를 불러오는 데 실패했습니다:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setAuthState({
      authenticated: false,
      currentUser: null,
    });
    navigate('/signIn');
  };

  return (
    <>
      <Header authenticated={authState.authenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route
          path="/productSale"
          element={
            authState.authenticated ? (
              <ProductSale />
            ) : (
              <Navigate to="/signIn" />
            )
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default AppWrapper;
