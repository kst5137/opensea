import { Link, Route, useNavigate } from "react-router-dom";
import './styles/Navbar.css';
import { useState, useEffect, React } from "react";

function Navbar({ token, setToken}) {
    const navigate = useNavigate();


    const handleLogout = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_email');
      localStorage.removeItem('profile_img');
      localStorage.removeItem('role');
      localStorage.removeItem('nickname');
      setToken(null);
      window.location.href = '/';
    };
  
    return (
        <header className="nav">
        <div className="logo">openSea</div>
        <nav className="nav-list">
          
          <Link to="/" className="nav-item">HOME</Link>
          <Link to="/explore" className="nav-item">Explore</Link>
          <Link to="/create" className="nav-item">Create</Link>
          <Link to="/profile" className="nav-item">MyPage</Link>
          {/* <Link to="/login" className="login-button">LOGIN</Link> */}
          {
            token ?
            (<button
                onClick={handleLogout}
                className="btn btn-danger"
              > 로그아웃 </button>)
            :  (<Link to="/login" className="login-button" >LOGIN</Link>)
          }
        </nav>
      </header>
    )
}

export default Navbar