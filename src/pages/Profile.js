import { useEffect } from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyNFT from '../components/MyNft';
import "./styles/ProfileModal.css";
import "./styles/Profile.css";
import LoadingSpinner from '../components/Loading';
function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState("");
  const [Image, setImage] = useState("");
  const fileInput = useRef(null)
  const [isLoading, setIsLoading] = useState(false);

  // 모달 프로필 이미지 관련 내용 부분
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // 파일이 존재하고 확장자가 이미지인지 확인
    if (file && file.type.startsWith("image/")) {
      // 파일 크기 확인
      if (file.size > MAX_FILE_SIZE) {
        alert("파일 크기는 2MB를 초과할 수 없습니다.");
        e.target.value = ""; // 선택 초기화
        return;
      }

      // 이미지 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);  // 이미지 상태 업데이트
      };
      reader.readAsDataURL(file);  // 파일을 데이터 URL로 읽기
    } else {
      alert("이미지 파일만 업로드 가능합니다.");
      e.target.value = ""; // 선택 초기화
    }
  };


  const [user, setUser] = useState(null); // user 상태 추가
  const token = localStorage.getItem('access_token');
  const user_email = JSON.parse(localStorage.getItem('user_email'));
  const navigate = useNavigate(); // navigate 함수 선언

  // 프로필에 보여지는 이미지
  useEffect(() => {
    const storedProfileImage = JSON.parse(localStorage.getItem('profile_img'));
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }
  }, []);

  // 로컬스토리지에 저장되는 이미지
  useEffect(() => {
    const userImagePath = JSON.parse(localStorage.getItem('profile_img'));
    if (userImagePath && userImagePath !== "") {
      setImage(userImagePath);
    } 
     }, []);


  useEffect(() => {
    const storedUser = localStorage.getItem('nickname');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleProfileUpdateClick = () => {
    setShowModal(true);  // 모달 띄우기
  };
  const handleCloseModal = () => {
    setShowModal(false); // 모달 닫기
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formdata = new FormData();
    const requestBody = {};
    // FormData에 nickname과 password를 추가합니다.
    if (nickname) formdata.append("nickname", nickname);
    if (password) formdata.append("password", password);

    // 이미지 파일이 있으면 profile_img로 추가합니다.
    if (fileInput.current.files[0]) {
      formdata.append("profile_img", fileInput.current.files[0]);
    }
    

    if (!token) {
      alert("로그인 토큰이 없습니다. 다시 로그인하세요.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/mypage/",
        formdata,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("사용자 정보가 성공적으로 업데이트되었습니다.");

      }
 
      if (response.data.updated_user) {
        const updatedUser = response.data.updated_user.nickname;
        const storedProfileImage = response.data.updated_user.profile_img;
        
        setUser(updatedUser);
        setProfileImage(storedProfileImage);

        localStorage.setItem('nickname', JSON.stringify(updatedUser));
        localStorage.setItem('profile_img', JSON.stringify(storedProfileImage)); // 추가
      }
      setIsLoading(false);
      handleCloseModal();
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert(error.response.data.detail);
            break;
          case 401:
            alert("인증에 실패했습니다. 다시 로그인하세요.");
            break;
          case 404:
            alert("사용자를 찾을 수 없습니다.");
            break;
          case 500:
            alert("서버 오류가 발생했습니다.");
            break;
          default:
            alert("오류가 발생했습니다.");
        }
      } else if (error.request) {
        alert("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
      } else {
        alert("요청 처리 중 오류가 발생했습니다.");
      }
      

    }
  };

  

  return (
    <div className="Profile">
      <div className={token ? "hidden" : ""}>
        <div className="alert alert-danger" role="alert">
          먼저 로그인을 해주세요.
        </div>
      </div>

      <div className={!token ? "hidden" : ""}>
        <div className="profile-header">
          <div className="profile-header-1">
          <div className="profile-img-container">
            <img src={profileImage} alt="Profile" className="profile-img" />
          </div>
            <h2 className="profile-header-title">{user}</h2>
            <button type="button" className="profileupdate-btn" onClick={handleProfileUpdateClick}>프로필 수정</button>
          </div>
        </div>
        <div className="profile-contents">
            {<MyNFT userEmail = {user_email}/>}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>프로필 수정</h2>
            {isLoading ? (
              <LoadingSpinner />
      ) : (
        <>
            <div className="profile-section">
              <div className="profileImageWrapper">
                <img 
                  src={Image} 
                  alt="Profile" 
                  className="profileImage"
                  onClick={() => fileInput.current.click()}
                />
              </div>
              <input
                type="file"
                ref={fileInput}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <form onSubmit={handleSubmit} className="userDetailForm">
              <div className="formGroup">
                <label>닉네임:</label>
                <input
                  type="text"
                  name="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="새로운 닉네임"
                />
              </div>
              
              <div className="formGroup">
                <label>새로운 비밀번호:</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="새로운 비밀번호"
                />
              </div>

              <div className="buttonContainer">
                <button type="submit" className="saveButton">수정하기</button>
                <button type="button" className="cancelButton" onClick={handleCloseModal}>
                  취소하기
                </button>
              </div>
            </form>
            </>
      )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Profile