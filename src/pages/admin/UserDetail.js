// /src/pages/admin/UserDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/UserDetail.css";

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

  // 실제 데이터 fetching 로직으로 대체하세요
  useEffect(() => {
    // 예시: API 호출을 통해 사용자 데이터 가져오기
    // fetch(`/api/users/${userId}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setUser({
    //       nickname: data.nickname,
    //       email: data.email,
    //       permission: data.permission,
    //     });
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setError("사용자 데이터를 가져오는 데 실패했습니다.");
    //     setLoading(false);
    //   });

    // 샘플 데이터 사용 (데이터 fetching 로직을 구현하지 않은 경우)
    const fetchUser = async () => {
      try {
        // 실제 API 호출을 여기에 추가하세요
        // 예를 들어:
        // const response = await axios.get(`/api/users/${userId}`);
        // setUser(response.data);

        // 샘플 데이터 사용
        const data = {
          nickname: "유저_닉네임",
          email: "user@example.com",
          permission: "관리자",
        };
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError("사용자 데이터를 가져오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchUser();
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
    // 여기에 데이터 저장 로직을 추가하세요
    // 예시: API 호출을 통해 사용자 데이터 업데이트
    // fetch(`/api/users/${userId}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(user),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     alert("사용자 정보가 성공적으로 업데이트되었습니다.");
    //     setIsEditing(false);
    //   })
    //   .catch((err) => {
    //     alert("사용자 정보 업데이트에 실패했습니다.");
    //   });

    // 예시: 저장 성공
    alert("사용자 정보가 성공적으로 업데이트되었습니다.");
    setIsEditing(false);
  };

  // 취소 버튼 클릭 핸들러
  const handleCancelClick = () => {
    // 데이터를 다시 가져오거나 초기 상태로 되돌릴 수 있습니다
    // 여기서는 간단히 수정 모드만 종료합니다
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
            value={user.permission || ""}
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
