// /src/pages/admin/UserDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/UserDetail.css";
import axios from "axios";

function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // 상태 관리
  const [user, setUser] = useState({
    nickname: "",
    email: "",
    permission: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        console.log(userId);
        const response = await axios.get(`http://127.0.0.1:8000/admin/userlist/${userId}`);
        setUser(response.data); // 유저 상세 정보 저장
        setLoading(false);
      } catch (err) {
        setError("유저 상세 정보를 가져오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };
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
  const handleSaveClick = () => {
fetch(`http://127.0.0.1:8000/admin/userlist/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nickname: user.nickname,
      email: user.email,
      role: user.role,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("사용자 정보 업데이트에 실패했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      alert("사용자 정보가 성공적으로 업데이트되었습니다.");
      setIsEditing(false); // 편집 모드 종료
    })
    .catch((error) => {
      console.error(error);
      alert("사용자 정보 업데이트에 실패했습니다.");
    });
  };

  // 취소 버튼 클릭 핸들러
  const handleCancelClick = () => {
    setIsEditing(false);
    // 필요하다면 원래 데이터를 다시 설정하세요
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
          <input
            type="text"
            name="permission"
            value={user.role || ""}
            placeholder="권한을 입력하세요"
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
      </div>
      <div className="buttonContainer">
        {!isEditing ? (
          <>
            <button className="backButton" onClick={() => navigate(-1)}>
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
}

export default UserDetail;
