import { useEffect } from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyNFT from '../components/MyNft';
import "./styles/ProfileModal.css";
import "./styles/Profile.css";

function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [Image, setImage] = useState("");
  // const [Image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
  const fileInput = useRef(null)

  const handleImageChange = (e) => {
  const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);  // 이미지 상태 업데이트
      };
      reader.readAsDataURL(file);  // 파일을 데이터 URL로 읽기
    }
  };

  const [user, setUser] = useState(null); // user 상태 추가
  // const [profileImg, setProfileImg] = useState(null); // user 상태 추가
  const token = localStorage.getItem('access_token');
  const user_email = JSON.parse(localStorage.getItem('user_email'));
  const navigate = useNavigate(); // navigate 함수 선언
  useEffect(() => {
    // localStorage에서 이미지 경로를 가져옵니다.
    const userImagePath = JSON.parse(localStorage.getItem('profile_img'));
    console.log("이미지 ㅈ경로",userImagePath);
    // 이미지 경로가 있으면 해당 경로 사용, 없으면 기본 이미지 사용
    if (userImagePath && userImagePath !== "") {
      console.log(userImagePath);
      setImage(userImagePath);
    } else {
      setImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
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

      console.log('requestbody',requestBody);
      console.log("프로필 수정 성공:", response.data);

      if (response.data.updated_user) {
        const updatedUser = response.data.updated_user.nickname;
        const updateProfileImg = response.data.updated_user.profile_img;
        setUser(updatedUser);
        localStorage.setItem('nickname', JSON.stringify(updatedUser));
        localStorage.setItem('profile_img', JSON.stringify(updateProfileImg));

      }
      // console.log(JSON.parse(localStorage.getItem('user')))

      handleCloseModal();
    } catch (error) {
      console.error("프로필 수정 실패:", error.response);
      if (error.response.status === 401) {
        alert("인증에 실패했습니다. 다시 로그인하세요.");
      } else {
        alert("오류가 발생했습니다.");
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
            <img src={Image} alt="Profile" className="profile-img" />
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
            <div className="profile-img-container-modal" onClick={() => fileInput.current.click()}>
            <img src={Image} alt="Profile" className="profile-img" />
          </div>
          <input
            type="file"
            ref={fileInput}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageChange}
          />
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="새로운 닉네임"
              />
            </div>
            <div>
              <label htmlFor="password">새로운 비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="새로운 비밀번호"
              />
            </div>
            {/* 버튼을 감싸는 div 추가 */}
            <div className="button-container">
              <button type="submit">수정하기</button>
              <button type="button" onClick={handleCloseModal}>취소</button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};
export default Profile