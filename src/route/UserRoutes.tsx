import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Main from '../components/Main';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import ProductAdd from '../components/ProductAdd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCurrentUser } from '../api/Utils';
import { ACCESS_TOKEN } from '../constants/constant';
import ProductEdit from '../components/ProductEdit';
import ProductDelete from '../components/ProductDelete';
import ProductSearch from '../components/ProductSearch';
import ProductDetail from '../components/ProductDetail';
import Chat from '../components/Chat';
import ProfileEdit from '../components/ProfileEdit';
import AdditionalInfo from '../components/AdditionalInfo';
import OAuth2RedirectHandler from '../api/OAuth2';
import UserWishes from '../components/UserWishes';
import UserProducts from '../components/UserProducts';

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
    navigate('/signin');
  };

  return (
    <>
      <Header authenticated={authState.authenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Main />} />
        {/* 메인 */}
        <Route path="/signin" element={<SignIn />} />
        {/* 로그인 */}
        <Route path="/signUp" element={<SignUp />} />
        {/* 회원가입 */}
        <Route path="/productDetail/:id" element={<ProductDetail />} />
        {/* 상품 상세보기 */}
        <Route path="/productSearch" element={<ProductSearch />} />
        {/* 상품 검색 */}
        <Route path="/productAdd" element={<ProductAdd />} />
        {/* 상품 등록 */}
        <Route path="/productEdit/:id" element={<ProductEdit />} />
        {/* 상품 수정 */}
        <Route path="/productDelete" element={<ProductDelete />} />
        {/* 상품 삭제 */}
        <Route path="/chat" element={<Chat />} />
        {/* 채팅 */}
        <Route path="/profileedit" element={<ProfileEdit />} />
        {/* 내 정보 수정 */}
        <Route path="/additionalInfo" element={<AdditionalInfo />} />
        {/* 추가 정보 입력 */}
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        {/* 토큰 추출 */}
        <Route path="/userwishes" element={<UserWishes />} />
        {/* 찜한 상품 조회 */}
        <Route path="/userproducts" element={<UserProducts />} />
        {/* 등록한 상품 조회 */}
        <Route path="/chat/:roomId" element={<Chat />} />
        {/* 채팅방 */}

        {/*<route*/}
        {/*  path="/productSale"*/}
        {/*  element={*/}
        {/*    authState.authenticated ? (*/}
        {/*      <ProductSale />*/}
        {/*    ) : (*/}
        {/*      <Navigate to="/signin" replace />*/}
        {/*    )*/}
        {/*  }*/}
        {/*/>*/}
      </Routes>
      <Footer />
    </>
  );
}

export default UserRoutes;
