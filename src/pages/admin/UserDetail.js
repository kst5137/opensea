import React, { useState, useEffect } from "react";
import "../styles/UserDetail.css";
import axios from "axios";

const UserDetail = ({ userId, onBack }) => {
  // 상태 관리
  const [user, setUser] = useState({
    nickname: "",
    email: "",
    permission: "",
    profile_img: "", // profile_img 필드 추가
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isInappropriate, setIsInappropriate] = useState(false);

  const handleInappropriateClick = () => {
    setIsInappropriate(true);
    setUser(prevUser => ({
      ...prevUser,
      profile_img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    }));
  };

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/admin/userlist/${userId}`);
      setUser(response.data);
      setIsInappropriate(false); // 데이터를 새로 불러올 때 불건전 이미지 상태 초기화
      setLoading(false);
    } catch (err) {
      setError("유저 상세 정보를 가져오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 저장 버튼 클릭 핸들러
  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/admin/userlist/${userId}`,
        {
          nickname: user.nickname,
          email: user.email,
          role: user.role,
          profile_img: user.profile_img // 수정 시에 함께 전송
        }
      );

      if (response.status === 200) {
        alert("사용자 정보가 성공적으로 업데이트되었습니다.");
        setIsEditing(false);
        onBack();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("사용자 정보 업데이트에 실패했습니다.");
    }
  };

  // 취소 버튼 클릭 핸들러
  const handleCancelClick = () => {
    setIsEditing(false);
    setIsInappropriate(false); // 취소 시 불건전 이미지 상태도 초기화
    fetchUserDetails(); 
  };

  if (loading) {
    return <div className="userDetailContainer">로딩 중...</div>;
  }

  if (error) {
    return <div className="userDetailContainer">{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }} className="userDetailContainer">
      <h2>유저 상세 관리</h2>
      <div className="profileSection">
        <div className={`profileImageWrapper ${isInappropriate ? 'inappropriate' : ''}`}>
          <img 
            src={user.profile_img || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
            alt="Profile" 
            className="profileImage"
          />
          {isInappropriate && <div className="inappropriateOverlay">불건전 이미지 </div>}
        </div>
      </div>
      <button 
        className="dangerImageButton" 
        onClick={handleInappropriateClick}
        disabled={isInappropriate}
      >
        불건전 이미지
      </button>
  
      <div className="userDetailForm">
        <div className="formGroup">
          <label>닉네임:</label>
          <input
            type="text"
            name="nickname"
            value={user.nickname || ""}
            placeholder="닉네임을 입력하세요"
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="formGroup">
          <label>이메일:</label>
          <input
            type="email"
            name="email"
            value={user.email || ""}
            placeholder="이메일을 입력하세요"
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="formGroup">
          <label>권한:</label>
          <select
            name="role"
            value={user.role || "user"}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>
      <div className="buttonContainer">
        {!isEditing ? (
          <>
            <button className="backButton" onClick={onBack}>
              돌아가기
            </button>
            <button className="editButton" onClick={handleEditClick}>
              수정하기
            </button>
          </>
        ) : (
          <>
            <button className="saveButton" onClick={handleSaveClick}>
              저장하기
            </button>
            <button className="cancelButton" onClick={handleCancelClick}>
              취소하기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetail;