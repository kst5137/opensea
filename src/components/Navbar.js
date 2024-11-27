import { Link, useNavigate } from "react-router-dom";
import './styles/Navbar.css';
import { useState, useEffect, React } from "react";

function Navbar({ }) {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
          setToken(storedToken);
        }
      }, []);

    const handleLogout = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_eamil');
      setToken(null);
      navigate('/'); 
    };
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setToken(token);
      }, []);

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
            :  (<Link to="/login" className="login-button">LOGIN</Link>)
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