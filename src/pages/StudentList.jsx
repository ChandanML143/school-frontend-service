import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import axiosConfig from '../api/axiosConfig';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newStudent, setNewStudent] = useState({ name: '', email: '', grade: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.get('/students');
      setStudents(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students. Ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosConfig.post('/students', newStudent);
      setStudents([...students, res.data]);
      setNewStudent({ name: '', email: '', grade: '' });
      setIsAdding(false);
    } catch (err) {
      setError('Failed to add student.');
      console.error(err);
    }
  };

  const handleRemoveStudent = async (id) => {
    try {
      await axiosConfig.post(`/students/remove/${id}`);
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      setError('Failed to remove student.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-lg mb-lg">
        <div>
          <h1 className="mb-sm text-2xl font-semibold">Students Management</h1>
          <p className="text-muted">View, add and organize registered students.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <UserPlus size={18} />
          {isAdding ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {error && <div className="btn-danger p-md mb-lg" style={{ padding: '1rem', borderRadius: 'var(--radius-md)' }}>{error}</div>}

      {isAdding && (
        <div className="card mb-lg animate-fade-in">
          <h3 className="mb-md">Add New Student</h3>
          <form className="flex gap-md" onSubmit={handleAddStudent} style={{ flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="input-label" htmlFor="name">Full Name</label>
              <input id="name" className="input-field" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} required />
            </div>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="input-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input-field" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} required />
            </div>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="input-label" htmlFor="grade">Grade</label>
              <input id="grade" className="input-field" value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary">Save Student</button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <div className="table-container shadow-sm border rounded-lg">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Grade</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted" style={{ padding: '2rem' }}>No students found</td>
                </tr>
              ) : (
                students.map(student => (
                  <tr key={student.id}>
                    <td>#{student.id}</td>
                    <td className="font-medium text-main">{student.name}</td>
                    <td>{student.email}</td>
                    <td><span style={{ padding: '0.25rem 0.5rem', background: 'var(--color-bg-base)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '500' }}>{student.grade || 'N/A'}</span></td>
                    <td className="text-center">
                      <button 
                        className="btn" 
                        style={{ padding: '0.35rem', background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}
                        onClick={() => handleRemoveStudent(student.id)}
                        title="Remove Student"
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

export default StudentList;
