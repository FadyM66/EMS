import { useEffect, useState } from 'react'
import Login from './components/Login'
import Companies from './components/Companies'
import Departments from './components/Departments'
import Employees from './components/Employees'
import Home from './components/Home'
// import './App.css'
import './assets/style/general.css'
import Cookies from 'js-cookie'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'

function App() {

  useEffect(() => {
    if (!Cookies.get('token') && window.location.pathname != '/login') {
      window.location.href = '/login'
    }
  }, []);
  
  return (
    <>
      <div className='main-container'>
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/companies' element={<Companies />} />
            <Route path='/departments' element={<Departments />} />
            <Route path='/employees' element={<Employees />} />
            <Route path='/home' element={<Home />} />
            <Route path='/' element={<Home />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
