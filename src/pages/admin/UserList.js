import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("nickname");


  useEffect(() => {
    fetchUsers();
  }, []);


    const fetchUsers = async () => {
        try {
        const response = await axios.get("http://127.0.0.1:8000/admin/userlist");
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
        } catch (err) {
        setError("유저 데이터를 가져오는 중 오류가 발생했습니다.");
        setLoading(false);
        }
    };


  const handleDeleteUser = async (e, userId) => {
    e.stopPropagation(); // 행 클릭 이벤트가 발생하지 않도록 방지
    if (window.confirm("정말로 이 사용자를 삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/admin/userlist/${userId}`);
        if (response.data.result === "success") {
          alert("사용자가 성공적으로 삭제되었습니다.");
          // 사용자 목록 새로고침
          fetchUsers();
        }
      } catch (error) {
        alert("사용자 삭제 중 오류가 발생했습니다.");
        console.error("Delete error:", error);
      }
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredUsers(users);
    setSearchType("nickname");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.length < 2) {
      alert("검색어를 두 글자 이상 입력해주세요.");
      return;
    }

    const filtered = users.filter(user => {
      const searchValue = user[searchType]?.toString().toLowerCase();
      return searchValue?.includes(searchTerm.toLowerCase());
    });

    setFilteredUsers(filtered);
  };

  const handleUserClick = (userId) => {
    onUserSelect(userId);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="info-card user-list-card">
      <h3>유저 관리</h3>
      <div className="search-bar">
        <select 
          value={searchType} 
          onChange={handleSearchTypeChange}
          className="search-select"
        >
          <option value="nickname">닉네임</option>
          <option value="email">이메일</option>
          <option value="role">권한</option>
        </select>
        <input 
          type="text" 
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={`${searchType === 'nickname' ? '닉네임' : searchType === 'email' ? '이메일' : '권한'}으로 검색...`}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleReset} className="reset-button">Reset</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>닉네임</th>
              <th>이메일</th>
              <th>권한</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} onClick={() => handleUserClick(user.id)}>
                <td>{user.nickname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button 
                    onClick={(e) => handleDeleteUser(e, user.id)}
                    className="delete-button"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;