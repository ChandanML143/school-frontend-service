import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, School, BookOpen } from 'lucide-react';
import './Dashboard.css';
import axiosConfig from '../api/axiosConfig';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
  });

  useEffect(() => {
    // Attempt to fetch stats. We mock it with 0 if API is down.
    const fetchStats = async () => {
      try {
        const [studentsRes, teachersRes] = await Promise.all([
           axiosConfig.get('/students'),
           axiosConfig.get('/teachers')
        ]);
        
        setStats({
          students: studentsRes.data.length || 0,
          teachers: teachersRes.data.length || 0
        });
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Students', value: stats.students, icon: <Users size={28} />, color: 'var(--color-primary)' },
    { title: 'Total Teachers', value: stats.teachers, icon: <GraduationCap size={28} />, color: 'var(--color-secondary)' },
    { title: 'Total Classes', value: 24, icon: <School size={28} />, color: 'var(--color-warning)' },
    { title: 'Active Courses', value: 48, icon: <BookOpen size={28} />, color: 'var(--color-success)' }
  ];

  return (
    <div className="dashboard">
      <div className="page-header mt-lg mb-lg">
        <h1>Dashboard Overview</h1>
        <p className="text-muted">Welcome back! Here is what's happening today.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div className="stat-card card card-hover" key={index}>
            <div className="stat-icon" style={{ backgroundColor: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <h3>{card.title}</h3>
              <p className="stat-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-lg card-hover">
        <h3 className="mb-md">Recent Activity</h3>
        <p className="text-muted">No recent activity detected on the network.</p>
      </div>
    </div>
  );
};

export default Dashboard;
