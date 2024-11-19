import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Main from '../components/Main';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import ProductSale from '../components/ProductSale';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCurrentUser } from '../api/Utils';
import { ACCESS_TOKEN } from '../constants/constant';

function UserRoutes() {
  const [authState, setAuthState] = useState({
    authenticated: false,
    currentUser: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadCurrentlyLoggedInUser();
  }, []); // 빈 배열을 명시하여 컴포넌트가 마운트될 때만 실행

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
        <Route path="/productSale" element={<ProductSale />} />
        {/*<Route*/}
        {/*  path="/productSale"*/}
        {/*  element={*/}
        {/*    authState.authenticated ? (*/}
        {/*      <ProductSale />*/}
        {/*    ) : (*/}
        {/*      <Navigate to="/signIn" replace />*/}
        {/*    )*/}
        {/*  }*/}
        {/*/>*/}
      </Routes>
      <Footer />
    </>
  );
}

export default UserRoutes;
