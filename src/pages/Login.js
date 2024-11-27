import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = async (event) => {
      event.preventDefault();
  
      try {
        const response = await axios.post(
          'http://localhost:8000/user/login',
          new URLSearchParams({
            username: username,
            password: password
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
  
        // 로그인 성공 시 토큰 저장
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_email', JSON.stringify(response.data.user_email));
        localStorage.setItem('profile_img', JSON.stringify(response.data.profile_img));
        
        console.log('로그인 성공', response.data);
        // 로그인 후 홈으로 리디렉션
        navigate('/');
        
      } catch (error) {
        console.error('Login error:', error.response);
      }
    };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">이메일</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">로그인하기</button>
    </form>
  );
};

export default Login;