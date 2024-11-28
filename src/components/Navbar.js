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
      navigate('/'); 
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



        // <div className="gnb">
        //     <nav className="nav">
        //         <div className="container-fluid">
        //             {/* logo */}
        //             <Link to="/BEB-05-LeeSea" className="navbar-brand">
        //                 LeeSea
        //             </Link>
        //             {/* items */}
        //             <div className="navbar-items">
        //                 <Link to="/BEB-05-LeeSea" className="nav-item">Home</Link>
        //                 <Link to="/BEB-05-LeeSea/explore" className="nav-item">Explore</Link>
        //                 <Link to="/BEB-05-LeeSea/create" className="nav-item">Create</Link>
        //                 <Link to="/BEB-05-LeeSea/profile" className="nav-item">Profile</Link>
        //                 {
        //                     token ?
        //                     (<button
        //                         onClick={handleLogout}
        //                         className="btn btn-danger"
        //                       > 로그아웃 </button>)
        //                     :  (<Link to="/BEB-05-LeeSea/Login" className="connect-wallet-btn btn btn-primary">로그인하기</Link>)
        //                 }
        //             </div>
        //         </div>
        //     </nav>
        // </div>
    )
}

export default Navbar