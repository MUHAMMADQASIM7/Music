import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ProtectedRoutes from './pages/protected';
import Main from './pages/main';

function App() {
  return (
    <Router>
    <Routes>
    <Route path='/' element={<Signin/>}></Route>
      <Route path='/Sign-up' element={<Signup/>}></Route>
      <Route path='/Sign-in' element={<Signin/>}></Route>
      <Route element={<ProtectedRoutes/>} >
      <Route path='/Main-page' element={<Main/>}></Route>  
      </Route>
    </Routes>
  </Router>
  );
}

export default App;
