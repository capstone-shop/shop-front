import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/login.module.css';

function Login() {
  let navigate = useNavigate();
  return (
    <div className={styles.login}>
      <h1>로그인</h1>
      <form action="">
        <div>
          <input placeholder="이메일" type="email" id="email" />
        </div>
        <div>
          <input placeholder="비밀번호" type="password" id="password" />
        </div>
        {/*여기 수정해야함.*/}
        <button onClick={() => navigate('/admin/category')}>로그인</button>
      </form>
      <a href="#">비밀번호 찾기</a>
    </div>
  );
}
export default Login;
