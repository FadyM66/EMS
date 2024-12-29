import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GeneralContextProvider } from './context/GeneralContext';

import Login from './pages/Login';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import Username from './components/Username';
import Logo from './components/Logo';
import User from './pages/User';
import CompaniesWrapper from './pages/Companies';
import DepartmentsWrapper from './pages/Departments';
import Employees from './pages/Employees';

import './assets/style/general.css';
import './assets/style/common.css';


function App() {

  const role = Cookies.get('role')

  useEffect(() => {
    if (!Cookies.get('token') && window.location.pathname != '/login') {
      window.location.href = '/login'
    }
  }, []);

  return (
    <>
      <Logo />
      {window.location.pathname != '/login' && (
        <>
          <TopBar />
          <Username />
          <Footer />
        </>
      )}
      {
        role == 'employee' ?
          <User /> :
          <Router>
            <GeneralContextProvider >
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/companies' element={<CompaniesWrapper />} />
                <Route path='/departments' element={<DepartmentsWrapper />} />
                <Route path='/employees' element={<Employees />} />
                <Route path='/user' element={<User />} />
              </Routes>
            </GeneralContextProvider>
          </Router>
      }
    </>
  );
}

export default App;
