import React from 'react';
import './styles/Loading.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>프로필 이미지 업로드 중...</p>
    </div>
  );
};

export default LoadingSpinner;