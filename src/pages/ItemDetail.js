import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/ItemDetail.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const PaymentResultModal = ({ isOpen, onClose, isSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {isSuccess ? (
            <span className="success">결제 성공</span>
          ) : (
            <span className="error">결제 실패</span>
          )}
        </h2>
        <p className="modal-message">
          {isSuccess 
            ? "결제가 성공적으로 완료되었습니다."
            : "결제 처리 중 오류가 발생했습니다. 다시 시도해 주세요."
          }
        </p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

const MakeOfferModal = ({ onClose, onSubmit, userEmail }) => {
  const [price, setPrice] = useState('');

  const handleChange = (e) => {
    setPrice(e.target.value);
  };

  const handleSubmit = () => {
    if (!price.trim()) {
      alert('가격을 입력해주세요.');
      return;
    }

    if (isNaN(price) || price <= 0) {
      alert('유효한 가격을 입력해주세요.');
      return;
    }

    if (window.confirm('제안하시겠습니까?')) {
      onSubmit({
        username: userEmail,
        price: price
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>제안하기</h2>
        <div className="input-group">
          <label>사용자 : </label>
          <div className="user-email">{userEmail}</div>
        </div>
        <div className="input-group">
          <label>제안 가격 (ETH)</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={handleChange}
            placeholder="가격을 입력하세요"
            step="0.01"
            min="0"
          />
        </div>
        <div className="modal-buttons">
          <button className="submit-btn" onClick={handleSubmit}>확인</button>
          <button className="cancel-btn" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

const AcceptOfferModal = ({ onClose, onConfirm, offerData }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>제안 수락</h2>
        <p>다음 제안을 수락하시겠습니까?</p>
        <div className="offer-details">
          <p>제안 가격: {offerData.offer_price} ETH</p>
          <p>제안자: {offerData.email}</p>
        </div>
        <div className="modal-buttons">
          <button className="submit-btn" onClick={onConfirm}>
            확인
          </button>
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
const ItemDetail = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [ethPrice, setEthPrice] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [acceptedOffer, setAcceptedOffer] = useState(null);
  const [hasAcceptedOffer, setHasAcceptedOffer] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    setUserEmail(email ? email.replace(/"/g, '') : '');

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    if (acceptedOffer && userEmail) {
      // console.log('Accepted offer email:', acceptedOffer.email);
      // console.log('Current user email:', userEmail.replace(/"/g, ''));
      // console.log('Is match:', acceptedOffer.email.trim().toLowerCase() === userEmail.replace(/"/g, '').trim().toLowerCase());
    }
  }, [acceptedOffer, userEmail]);

  useEffect(() => {
    if (itemData && itemData.post) {
      const currentUserEmail = localStorage.getItem('user_email')
        ?.replace(/[\"\\]/g, '');
      const isAuthorMatch = 
        currentUserEmail && 
        itemData.post.user_id && 
        currentUserEmail.trim().toLowerCase() === String(itemData.user_info.email).trim().toLowerCase();
      
      setIsAuthor(isAuthorMatch);
    }

    if (itemData?.offers) {
      const accepted = itemData.offers.find(offer => offer.is_accepted);
      setAcceptedOffer(accepted);
      setHasAcceptedOffer(Boolean(accepted));
    }
  }, [itemData]);

  const checkLikeStatus = async () => {
    try {
      const response = await axios.get(`/posts/${itemId}/like/check`, {
        params: { user_email: userEmail }
      });
      setIsLiked(response.data.liked);
    } catch (err) {
      console.error('Error checking like status:', err);
    }
  };

  const fetchEthPrice = async () => {
    try {
      const response = await axios.get('https://api.upbit.com/v1/ticker?markets=KRW-ETH');
      const price = Math.floor(response.data[0].trade_price);
      setEthPrice(price);
    } catch (err) {
      console.error('Error fetching ETH price:', err);
    }
  };

  const fetchOfferList = async () => {
    try {
      const response = await axios.get(`/posts/${itemId}/offerlist`);
      const hasAccepted = response.data.has_accepted_offer;
      setHasAcceptedOffer(hasAccepted);
      
      if (response.data.offers) {
        const accepted = response.data.offers.find(offer => offer.is_accepted);
        setAcceptedOffer(accepted);
      }
    } catch (err) {
      console.error('Error fetching offer list:', err);
    }
  };

  const fetchItemDetail = async () => {
    try {
      const response = await axios.get(`/posts/${itemId}`);
      if (response.data.offers) {
        response.data.offers.sort((a, b) => b.id - a.id);
      }
      setItemData(response.data);
    } catch (err) {
      setError('아이템 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching item detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetail();
    fetchEthPrice();
    fetchOfferList();
    if (userEmail) {
      checkLikeStatus();
    }
  }, [itemId, userEmail]);

  const handleLikeToggle = async () => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.post(`/posts/${itemId}/like`, {
        post_id: parseInt(itemId),
        user_email: userEmail
      });
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleBuy = () => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!ethPrice) {
      alert('가격 정보를 불러오는데 실패했습니다.');
      return;
    }

    const isAcceptedOfferUser = acceptedOffer && 
      acceptedOffer.email.trim().toLowerCase() === userEmail.replace(/"/g, '').trim().toLowerCase();
    if (acceptedOffer && !isAcceptedOfferUser) {
      alert('이 상품은 제안이 수락된 사용자만 구매할 수 있습니다.');
      return;
    }

    let finalPrice;
    if (isAcceptedOfferUser) {
      finalPrice = acceptedOffer.offer_price;
    } else {
      finalPrice = itemData.post.expected_price;
    }

    const totalAmount = Math.floor(ethPrice * finalPrice);

    const tossPayments = window.TossPayments("test_ck_PBal2vxj81P9lJQZP4wAr5RQgOAN");
    const payment = tossPayments.payment({customerKey: "test_ck_PBal2vxj81P9lJQZP4wAr5RQgOAN"});
    
    payment.requestPayment({
      method: "CARD",
      amount: {
        currency: "KRW",
        value: totalAmount,
      },
      orderId: `order_${itemId}_${Date.now()}`,
      orderName: itemData.post.item_name,
      customerEmail: userEmail,
      customerName: userEmail.split('@')[0],
      card: {
        useEscrow: false,
        flowMode: "DEFAULT",
        useCardPoint: false,
        useAppCardOnly: false,
      },
    })
    .then(async () => {
      try {
        await axios.put(`/posts/${itemId}/sold`, {
          user_email: userEmail,
          sold_price: finalPrice,
          offer_id: isAcceptedOfferUser ? acceptedOffer.id : null
        });
        
        setIsPaymentSuccess(true);
        setIsPaymentModalOpen(true);
        setItemData(prevData => ({
          ...prevData,
          post: {
            ...prevData.post,
            is_sold: 1,
            sold_price: finalPrice
          }
        }));
      } catch (error) {
        console.error('Error updating post sold status:', error);
        setIsPaymentSuccess(false);
        setIsPaymentModalOpen(true);
      }
    })
    .catch((error) => {
      setIsPaymentSuccess(false);
      setIsPaymentModalOpen(true);
      console.error('Payment error:', error);
    });
  };

  const handleEdit = () => {
    navigate(`/posts/${itemId}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/posts/${itemId}/delete`);
        alert('성공적으로 삭제되었습니다.');
        navigate('/explore');
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleGoToList = () => {
    navigate('/explore');
  };

  const handleMakeOffer = () => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (hasAcceptedOffer) {
      alert('이미 수락된 제안이 있습니다.');
      return;
    }
    setShowOfferModal(true);
  };

  const handleSubmitOffer = async (offerData) => {
    try {
      await axios.post(`/posts/${itemId}/offer`, {
        user_email: offerData.username,
        post_id: parseInt(itemId),
        offer_price: parseFloat(offerData.price)
      });

      await fetchOfferList();
      await fetchItemDetail();
      alert('제안이 성공적으로 등록되었습니다!');
      setShowOfferModal(false);
    } catch (err) {
      alert('제안 등록 중 오류가 발생했습니다.');
      console.error('Error making offer:', err);
    }
  };

  const handleAcceptOffer = (offer) => {
    setSelectedOffer(offer);
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = async () => {
    try {
      await axios.put(`/posts/${itemId}/accept`, {
        offer_id: selectedOffer.id
      });
      
      await fetchOfferList();
      setShowAcceptModal(false);
      alert('제안이 성공적으로 수락되었습니다!');
    } catch (err) {
      alert('제안 수락 중 오류가 발생했습니다.');
      console.error('Error accepting offer:', err);
    }
  };

  const renderActionButtons = () => {
    if (isAuthor) {
      return (
        <div className="action-buttons">
          <button 
            className="action-btn edit-btn"
            onClick={handleEdit}
            disabled={itemData.post.is_sold}
            title={itemData.post.is_sold ? "판매 완료된 게시글은 수정할 수 없습니다" : ""}
          >
            수정하기
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={handleDelete}
            disabled={itemData.post.is_sold}
            title={itemData.post.is_sold ? "판매 완료된 게시글은 삭제할 수 없습니다" : ""}
          >
            삭제하기
          </button>
          <button 
            className="action-btn list-btn" 
            onClick={handleGoToList}
          >
            목록으로
          </button>
        </div>
      );
    }

    const isAcceptedOfferUser = acceptedOffer && 
      acceptedOffer.email.trim().toLowerCase() === userEmail.trim().toLowerCase();
    
    const buyButtonText = itemData.post.is_sold 
      ? '판매 완료' 
      : isAcceptedOfferUser 
        ? `수락가격 ${acceptedOffer.offer_price} ETH 결제`
        : '구매하기';

    return (
      <div className="action-buttons">
        <button 
          className={`action-btn buy-btn ${itemData.post.is_sold ? 'sold-out' : ''}`}
          onClick={handleBuy}
          disabled={itemData.post.is_sold || !userEmail || (acceptedOffer && !isAcceptedOfferUser)}
          title={
            !userEmail 
              ? "로그인이 필요합니다" 
              : itemData.post.is_sold 
                ? "판매 완료" 
                : acceptedOffer && !isAcceptedOfferUser 
                  ? "제안이 수락된 사용자만 구매할 수 있습니다"
                  : ""
          }
        >
          {buyButtonText}
        </button>
        <button 
          className="action-btn offer-btn" 
          onClick={handleMakeOffer}
          disabled={itemData.post.is_sold || hasAcceptedOffer || !userEmail}
          title={!userEmail ? "로그인이 필요합니다" : itemData.post.is_sold ? "판매 완료" : hasAcceptedOffer ? "이미 수락된 제안이 있습니다" : ""}
        >
          제안하기
        </button>
        <button 
          className="action-btn list-btn" 
          onClick={handleGoToList}
        >
          목록으로
        </button>
      </div>
    );
  };

  const renderActionButton = (offer) => {
    if (offer.is_accepted) {
      return <span className="accepted-badge">수락됨</span>;
    }
    
    if (hasAcceptedOffer || itemData.post.is_sold || !isAuthor) {
      return null;
    }
    
    return (
      <button
        className="accept-btn"
        onClick={() => handleAcceptOffer(offer)}
      >
        수락
      </button>
    );
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!itemData) return <div>아이템을 찾을 수 없습니다.</div>;

  return (
    <div className="detail-container">
      <div className="content">
        <div className="item-image-detail-container">
          <div className="item-image sticky">
            <div 
              className="placeholder-image"
              onClick={() => setShowImageModal(true)}
            >
              {itemData.post.img_url ? (
                <img 
                  src={itemData.post.img_url} 
                  alt={itemData.post.item_name}
                  draggable="false"
                />
              ) : (
                <span>이미지</span>
              )}
            </div>
          </div>
        </div>

        <div className="item-info">
          <div className="title-detail-container">
            <div className="title-wrapper">
              <h1 className="item-title">{itemData.post.item_name}</h1>
            </div>
            <button 
              className={`like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLikeToggle}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
          </div>
          <p className="owner">
            Owned by {itemData.user_info.email}
          </p>
          <h2 className={`item-price ${itemData.post.is_sold ? 'sold-out' : ''}`}>
          {itemData.post.is_sold ? '판매 완료' : `${itemData.post.expected_price} ETH`}
          </h2>
          
          <div className="description">
            <h3>Description</h3>
            <p>{itemData.post.description}</p>
          </div>

          {renderActionButtons()}

          <div className="offers">
            <h3>Offered List</h3>
            <div className="offers-list">
              {itemData.offers && itemData.offers.length > 0 ? (
                itemData.offers.map(offer => (
                  <div key={offer.id} className="offer-item">
                    <span className="column-price">{offer.offer_price} ETH</span>
                    <span className="column-user">{offer.email}</span>
                    <span className="column-date">{offer.created_date}</span>
                    <span className="column-action">
                      {renderActionButton(offer)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty-offers">
                  <p>아직 제안이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showOfferModal && (
        <MakeOfferModal
          onClose={() => setShowOfferModal(false)}
          onSubmit={handleSubmitOffer}
          userEmail={userEmail}
        />
      )}

      {showImageModal && (
        <div className="image-modal" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content">
            <img 
              src={itemData.post.img_url} 
              alt={itemData.post.item_name} 
              draggable="false"
            />
          </div>
        </div>
      )}

      {showAcceptModal && selectedOffer && (
        <AcceptOfferModal
          onClose={() => setShowAcceptModal(false)}
          onConfirm={handleConfirmAccept}
          offerData={selectedOffer}
        />
      )}

      <PaymentResultModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        isSuccess={isPaymentSuccess}
      />
    </div>
  );
};

export default ItemDetail;