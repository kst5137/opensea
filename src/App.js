import { Route, Routes} from "react-router-dom";
import { useState, useEffect } from "react";
import './App.css';
import Navbar from './components/Navbar';
import { Home, Profile, Create, Explore,  Login, ItemDetail } from './pages';
import {UserList, UserDetail }  from './pages/admin';

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


  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "amin"); // role이 "admin"이면 true로 설정
  }, []);
  // const isAdmin = false;
  console.log(isAdmin);
  return (
    <div className="App">
      <Navbar token={token} setToken={setToken}/>
      {isAdmin ? (
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/admin/user/:userId" element={<UserDetail />} />
        </Routes>
      ) :(
        
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create" element={<Create />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/posts/:itemId" element={<ItemDetail />} />
            <Route path="/Login" element={<Login setToken={setToken}/>} />
        </Routes>
      )
      }
      
    </div>
  );
}

export default App;