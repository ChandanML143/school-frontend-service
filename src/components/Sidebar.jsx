import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, GraduationCap, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Students', path: '/students', icon: <Users size={20} /> },
    { name: 'Teachers', path: '/teachers', icon: <GraduationCap size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <BookOpen size={24} />
        </div>
        <h2>EduMana</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
