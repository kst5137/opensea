import React, { useState } from "react";
import useLocalStorage from "use-local-storage";
import { useNavigate } from "react-router-dom";
import "./styles/Signup.css";

const Signup = () => {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 비밀번호 확인이 변경될 때마다 비밀번호 일치 여부 확인
    if (name === "confirmPassword") {
      setPasswordMatch(formData.password === value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || "회원가입 실패"); // 서버에서 보낸 에러 메시지 표시
        setIsLoading(false);
        return;
      }

      alert("회원가입에 성공하였습니다. 로그인해주세요!");
      navigate("/login");
    } catch (err) {
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app" data-theme={theme}>
      <div className="signup">
        <h1>Sign Up</h1>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {formData.confirmPassword && (
              <p
                className={`password-match ${
                  passwordMatch ? "valid" : "invalid"
                }`}
              >
                {passwordMatch ? "Passwords match!" : "Passwords do not match."}
              </p>
            )}
            <label htmlFor="nickname">Nickname</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              placeholder="Enter your nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={isLoading || !passwordMatch}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          <p className="login-link" onClick={() => navigate("/login")}>
            Already have an account? Log in here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
