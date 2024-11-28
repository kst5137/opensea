import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { Home, Profile, Create, Explore,  Login, ItemDetail } from './pages';
import {UserList, UserDetail,  AdminPage }  from './pages/admin';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);
  useEffect(() => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        setToken(storedToken);
      }
    }, []);
  useEffect(() => {
      const token = localStorage.getItem('access_token');
      setToken(token);
    }, []);


  return (
    <router>
      <div className="App">
        <Navbar token={token} setToken={setToken}/>
        <Routes>
        {isAdmin ? (
          <>
            <Route path="/" element={<AdminPage />} />
            <Route path="/admin/user" element={<UserList />} />
            <Route path="/admin/user/:userId" element={<UserDetail />} />
          </>
        ) :(
          <>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create" element={<Create />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/posts/:itemId" element={<ItemDetail />} />
            <Route path="/Login" element={<Login setToken={setToken} setIsAdmin={setIsAdmin}/>} />
          </>
        )
        }
        </Routes>
      </div>
    </router>
  );
}

export default App;