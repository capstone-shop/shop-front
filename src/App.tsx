import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import SignIn from './components/SignIn';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={''} />
        <Route path="/about" element={''} />
        <Route path="/contact" element={''} />
        <Route path="/signIn" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
