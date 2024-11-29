import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserInfo() {
  const [userData, setUserData] = useState({
    totalUsers: 0,
    adminCount: 0,
    userCount: 0,
    newUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/admin/userlist');
        const users = response.data;
        
        // 현재 날짜 기준 7일 전 날짜 계산
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);


        const analysisData = users.reduce((acc, user) => {
          acc.totalUsers++;
          
          // role에 따른 카운트
          if (user.role === 'admin') {
            acc.adminCount++;
          } else {
            acc.userCount++;
          }
          
          // 신규 가입자 체크 (7일 이내)
          const userCreatedDate = new Date(user.create_date);
          if (userCreatedDate >= sevenDaysAgo) {
            acc.newUsers++;
          }
          
          return acc;
        }, {
          totalUsers: 0,
          adminCount: 0,
          userCount: 0,
          newUsers: 0
        });

        setUserData(analysisData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('사용자 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="info-card">로딩 중...</div>;
  if (error) return <div className="info-card">{error}</div>;

  return (
    <div className="info-card">
      <h3>유저 정보</h3>
      <p>전체 유저 수: <span className="highlight-count">{userData.totalUsers}</span></p>
      <p>관리자 수: <span className="highlight-admin">{userData.adminCount}</span></p>
      <p>일바 유저 수: <span className="highlight-user">{userData.userCount}</span></p>
      <p>신규 유저(7일): <span className="highlight-new">{userData.newUsers}</span></p>
    </div>
  );
}

export default UserInfo;