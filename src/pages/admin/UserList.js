// src/pages/admin/UserList.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UserList.css";

function UserList() {
  const [users, setUsers] = useState([]); // 유저 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/admin/userlist");
        setUsers(response.data); // 응답 데이터 저장
        console.log(response.data);
        setLoading(false); // 로딩 상태 해제
      } catch (err) {
        setError("유저 데이터를 가져오는 중 오류가 발생했습니다."); // 에러 저장
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  return (
    <div className="userListContainer">
      <h2>유저dd 관리</h2>
      <div className="searchBar">
        <input type="text" placeholder="Search users..." />
        <button className="searchButton">Search</button>
      </div>
      <table className="userTable">
        <thead>
          <tr>
            <th>닉네임</th>
            <th>이메일</th>
            <th>권한</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} onClick={() => handleUserClick(user.id)}>
              <td>{user.nickname}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
