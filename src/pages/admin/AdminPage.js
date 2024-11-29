import React, { useState } from 'react';
import DashboardMenu from './DashboardMenu';
import ProductInfo from './ProductInfo';
import UserInfo from './UserInfo';
import UserList from './UserList';
import UserDetail from './UserDetail';
import '../styles/AdminPage.css';


const AdminPage = () => {
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [selectedUserId, setSelectedUserId] = useState(null);
  
    const handleMenuClick = (menuName) => {
      setActiveMenu(menuName);
      setSelectedUserId(null);  // 메뉴 변경 시 selectedUserId 초기화
    };
  
    const handleUserSelect = (userId) => {
      setSelectedUserId(userId);
    };
  
    const handleBackToList = () => {
      setSelectedUserId(null);
    };
  
    return (
      <div className="admin-page-container">
        <DashboardMenu 
          activeMenu={activeMenu} 
          onMenuClick={handleMenuClick}  // setActiveMenu 대신 handleMenuClick 전달
        />
        <div className="main-content">
          {activeMenu === 'dashboard' ? (
            <>
              <ProductInfo />
              <UserInfo />
            </>
          ) : (
            <>
              {selectedUserId ? (
                <UserDetail 
                  userId={selectedUserId} 
                  onBack={handleBackToList}
                />
              ) : (
                <UserList onUserSelect={handleUserSelect} />
              )}
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default AdminPage;