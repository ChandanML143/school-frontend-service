import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content" style={{ marginLeft: '260px' }}>
        <div className="page-container animate-fade-in">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default Layout;
