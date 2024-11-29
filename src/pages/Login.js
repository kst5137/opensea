import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 리다이렉트를 위한 React Router 사용
import "./styles/Login.css";

const Login = ({ setToken, setIsAdmin, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(""); // 환영 메시지 상태
  const navigate = useNavigate(); // React Router의 navigate 함수 사용

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setWelcomeMessage("");
    console.log(email, password);
    try {
      const response = await axios.post(
        "http://localhost:8000/user/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = response.data;
      console.log(data);
      // 데이터 처리 및 상태 업데이트
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("nickname", JSON.stringify(data.nickname));
      localStorage.setItem("user_email", JSON.stringify(data.user_email));
      localStorage.setItem("profile_img", JSON.stringify(data.profile_img));
      localStorage.setItem("role", response.data.role);

      if (window.confirm(`${data.nickname}님, 환영합니다!`)) {
        // 확인 버튼 클릭 시 리다이렉트
        navigate("/");
      }
      setToken(data.access_token);
      setIsAdmin(data.role === "admin");
      setIsLoggedIn(true);
    } catch (err) {
      if (err.response) {
        // 객체에서 적절한 메시지를 추출
        const errorMessage = err.response.data.msg || "로그인에 실패했습니다.";
        setError(errorMessage);
      } else if (err.request) {
        setError("서버로부터 응답이 없습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="login">
        <h1>Login</h1>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          {welcomeMessage && <p className="welcome">{welcomeMessage}</p>}
          <p
            className="create"
            onClick={() =>
              (window.location.href = "http://localhost:3000/signup")
            }
          >
            Create Account
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
