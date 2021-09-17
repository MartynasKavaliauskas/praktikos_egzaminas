import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './AdminPage.css';

const AdminPage = () => {
  // Hooks
  // state
  // local
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usersList, setUsersList] = useState([]);

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // effects
  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    axios.get('http://localhost:3002/api/users').then((response) => {
      setUsersList(response.data);
      return;
    });
  };

  const addingNewUser = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3002/api/users', {
        name,
        age,
        email,
        password,
      })
      .then((response) => {
        getAllUsers();
      });
  };

  const updateUser = (id) => {
    axios
      .put('http://localhost:3002/api/users', {
        id: id,
        name: newUserName,
        email: newUserEmail,
      })
      .then((response) => {
        console.log('msg');
        getAllUsers();
      })
      .catch((err) => console.log(err));
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:3002/api/users/${id}`).then((response) => {
      getAllUsers();
    });
  };

  return (
    <main>
      <h1>Admin Page</h1>

      <form onSubmit={addingNewUser} className='form'>
        <label>Name: </label>
        <input type='text' onChange={(e) => setName(e.target.value)} />
        <label>Age: </label>
        <input type='number' onChange={(e) => setAge(e.target.value)} />
        <label>Email: </label>
        <input type='text' onChange={(e) => setEmail(e.target.value)} />
        <label>Password: </label>
        <input type='password' onChange={(e) => setPassword(e.target.value)} />

        <input type='submit' />
      </form>

      <h2>Users List</h2>
      <div className='userCards__container'>
        {usersList.map((user, key) => {
          return (
            <div key={key} className='userCard'>
              <h3>Name: {user.name}</h3>
              <h4>Year: {user.age}</h4>
              <h4>Email: {user.email}</h4>
              <div className='input__container'>
                <input
                  type='text'
                  placeholder='New user name'
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
                <input
                  type='text'
                  placeholder='New user email'
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className='btn__container'>
                <button onClick={() => updateUser(user._id)}>Update</button>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default AdminPage;
