import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

export default function Records() {
  const [records, setRecords] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://localhost:8000/record');
      setRecords(response.data.lists);
    } catch (err) {
      console.error('Error fetching records:', err.message);
    }
  };

  const addRecord = async () => {
    if (!name || !email || !phone) {
      console.error('Name, Email, and Phone cannot be empty');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/record', { name, email, phone });
      if (response.data.task) {
        setRecords([...records, response.data.task]);
        setName('');
        setEmail('');
        setPhone('');
      } else {
        console.error('No Record returned from the server');
      }
    } catch (err) {
      console.error('Error adding record:', err.message);
    }
  };

  const deleteRecord = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/record/${id}`);
      setRecords(records.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting record:', err.message);
    }
  };

  const handleEdit = (record) => {
    setEditing(record._id);
    setName(record.name);
    setEmail(record.email);
    setPhone(record.phone);
  };

  const updateRecord = async () => {
    try {
      const response = await axios.patch(`http://localhost:8000/record/${editing}`, { name, email, phone });
      setRecords(records.map(t => (t._id === editing ? response.data.updatedRecord : t)));
      setEditing(null);
      setName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      console.error('Error updating record:', err.message);
    }
  };

  return (
    <div className="container">
      <h1>Record Manager</h1>
      <hr />
      <br />
      <fieldset>
        <br />
        <legend>Personal Info</legend>
        <div className="input-container">
          <input
            type="text"
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="number"
            className="input"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="btn btn-primary" onClick={editing ? updateRecord : addRecord}>
            {editing ? 'Update Record' : 'Add Record'}
          </button>
        </div>
      </fieldset>
      <ul className="record-list">
        {records.map(t => (
          <li key={t._id} className="record-item">
            <div>
              <h3>{t.name}</h3>
              <p>Email: {t.email}</p>
              <p>Phone: {t.phone}</p>
            </div>
            <div className="action-buttons">
              <button className="btn btn-edit" onClick={() => handleEdit(t)}><i class="fa-regular fa-pen-to-square"></i></button>
              <button className="btn btn-delete" onClick={() => deleteRecord(t._id)}><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
