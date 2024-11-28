import React from 'react';

const DashboardMenu = ({ activeMenu, onMenuClick }) => {  
  return (
    <div className="dashboard-menu">
      <h2>관리자 페이지</h2>
      <ul>
        <li>
          <button 
            onClick={() => onMenuClick('dashboard')} 
            className={activeMenu === 'dashboard' ? 'active' : ''}
          >
            대시보드
          </button>
        </li>
        <li>
          <button 
            onClick={() => onMenuClick('userList')} 
            className={activeMenu === 'userList' ? 'active' : ''}
          >
            유저관리
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DashboardMenu;