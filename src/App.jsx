import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useEffect } from 'react';

import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import Users from './components/Users';
import AddExchange from './components/AddExchange';
import AddBankAccount from './components/AddAccount';
import DepositRequests from './components/DepositRequests';
import WithdrawRequests from './components/WithdrawRequests';
import UserDashboard from './components/UserDashboard';
import NewAccount from './components/NewAccount';
import ViewAccountRequests from './components/ViewAccountRequests';
import ViewAccount from './components/ViewAccount';
import ApprovedAccounts from './components/ApprovedAccounts';
import UserDeposit from './components/UserDeposit';
import UserWithdraw from './components/UserWithdraw';
import UserDepositHistory from './components/UserDepositHistory';
import UserWithdrawHistory from './components/UserWithdrawHistory';
import UserComplain from './components/UserComplain';
import ViewComplaints from './components/ViewComplaints';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import { AdminRoute, UserRoute } from './components/ProtectedRoute';

  return (
    <Router>
      <div className="app-container">
        {/* <CustomCursor /> */}
        <Preloader />
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/Users/Login" element={<Login />} />
          <Route path="/Users/Register" element={<Register />} />
          
          {/* Admin Protected Routes */}
          <Route path="/Admin/Dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/Account" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/Add/Exchange/Account" element={<AdminRoute><AddExchange /></AdminRoute>} />
          <Route path="/Add/Account" element={<AdminRoute><AddBankAccount /></AdminRoute>} />
          <Route path="/Deposit/Requests" element={<AdminRoute><DepositRequests /></AdminRoute>} />
          <Route path="/Withdraw/Requests" element={<AdminRoute><WithdrawRequests /></AdminRoute>} />
          <Route path="/View/New/AccountRequest" element={<AdminRoute><ViewAccountRequests /></AdminRoute>} />
          <Route path="/Accounts/Approved" element={<AdminRoute><ApprovedAccounts /></AdminRoute>} />
          <Route path="/View/Complaints" element={<AdminRoute><ViewComplaints /></AdminRoute>} />
          
          {/* User Protected Routes */}
          <Route path="/User/Dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
          <Route path="/User/New/Account" element={<UserRoute><NewAccount /></UserRoute>} />
          <Route path="/User/View/Account" element={<UserRoute><ViewAccount /></UserRoute>} />
          <Route path="/User/Deposit" element={<UserRoute><UserDeposit /></UserRoute>} />
          <Route path="/User/Withdraw" element={<UserRoute><UserWithdraw /></UserRoute>} />
          <Route path="/User/Deposit/History" element={<UserRoute><UserDepositHistory /></UserRoute>} />
          <Route path="/User/Withdraw/History" element={<UserRoute><UserWithdrawHistory /></UserRoute>} />
          <Route path="/User/Complain" element={<UserRoute><UserComplain /></UserRoute>} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App
