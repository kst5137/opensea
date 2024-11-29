import React, { useState } from "react";
import useLocalStorage from "use-local-storage";
import { useNavigate } from "react-router-dom"; // 리다이렉트를 위한 React Router 사용
import "./styles/Login.css";

function Login() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(""); // 환영 메시지 상태
  const navigate = useNavigate(); // React Router의 navigate 함수 사용

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setWelcomeMessage("");

    try {
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Login failed");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);

      // nickname을 환영 메시지로 설정
      window.confirm(`${data.nickname}님, 환영합니다!`);

      // 1초 후 리다이렉트
      setTimeout(() => {
        navigate("/"); // 경로만 설정 ("/"는 루트로 리다이렉트)
      }, 1000);
    } catch (err) {
      setError("다시 시도해주세요");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app" data-theme={theme}>
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
}

export default Login;
