import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import axiosConfig from '../api/axiosConfig';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', subject: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Endpoint mapping based on what ApiGateway usually exposes.
      // If teachers-service uses something slightly different to fetch, 
      // we might need to adjust this in the future.
      const response = await axiosConfig.get('/teachers');
      setTeachers(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch teachers. Ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosConfig.post('/teachers', newTeacher);
      setTeachers([...teachers, res.data]);
      setNewTeacher({ name: '', email: '', subject: '' });
      setIsAdding(false);
    } catch (err) {
      setError('Failed to add teacher.');
      console.error(err);
    }
  };

  const handleRemoveTeacher = async (id) => {
    try {
      await axiosConfig.delete(`/teachers/${id}`);
      setTeachers(teachers.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to remove teacher. The endpoint might not exist.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-lg mb-lg">
        <div>
          <h1 className="mb-sm text-2xl font-semibold">Teacher Directory</h1>
          <p className="text-muted">Manage educators, their details and subjects.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <UserPlus size={18} />
          {isAdding ? 'Cancel' : 'Register Teacher'}
        </button>
      </div>

      {error && <div className="btn-danger mb-lg" style={{ padding: '1rem', borderRadius: 'var(--radius-md)' }}>{error}</div>}

      {isAdding && (
        <div className="card mb-lg animate-fade-in border rounded-lg shadow-sm">
          <h3 className="mb-md">Register New Teacher</h3>
          <form className="flex gap-md" onSubmit={handleAddTeacher} style={{ flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="input-label" htmlFor="name">Full Name</label>
              <input id="name" className="input-field" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} required />
            </div>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="input-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input-field" value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} required />
            </div>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="input-label" htmlFor="subject">Subject</label>
              <input id="subject" className="input-field" value={newTeacher.subject} onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary">Save Teacher</button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading teachers...</p>
      ) : (
        <div className="table-container shadow-sm border rounded-lg">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted" style={{ padding: '2rem' }}>No teachers registered</td>
                </tr>
              ) : (
                teachers.map(teacher => (
                  <tr key={teacher.id}>
                    <td>#{teacher.id}</td>
                    <td className="font-medium text-main">{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td>
                      <span style={{ padding: '0.25rem 0.5rem', background: 'var(--color-primary-light)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '500' }}>
                        {teacher.subject || 'N/A'}
                      </span>
                    </td>
                    <td className="text-center">
                      <button 
                        className="btn" 
                        style={{ padding: '0.35rem', background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}
                        onClick={() => handleRemoveTeacher(teacher.id)}
                        title="Remove Teacher"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherList;
