// src/pages/admin/UserList.js

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserList.css";

function UserList() {
  const navigate = useNavigate();

  // Sample user data (replace with your actual data fetching logic)
  const users = [
    {
      id: 1,
      nickname: "유저_닉네임",
      email: "유저 이메일",
      date: "20xx.10.xx",
    },
    {
      id: 2,
      nickname: "유저_닉네임",
      email: "유저 이메일",
      date: "20xx.10.xx",
    },
    {
      id: 3,
      nickname: "유저_닉네임",
      email: "유저 이메일",
      date: "20xx.10.xx",
    },
  ];

  const handleUserClick = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  return (
    <div className="userListContainer">
      <h2>유저 관리</h2>
      <div className="searchBar">
        <input type="text" placeholder="Search users..." />
        <button className="searchButton">Search</button>
      </div>
      <table className="userTable">
        <thead>
          <tr>
            <th>닉네임</th>
            <th>이메일</th>
            <th>가입일자</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} onClick={() => handleUserClick(user.id)}>
              <td>{user.nickname}</td>
              <td>{user.email}</td>
              <td>{user.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
