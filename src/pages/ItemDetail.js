import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/ItemDetail.css';

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

const MakeOfferModal = ({ onClose, onSubmit }) => {
  const [offerData, setOfferData] = useState({
    username: '',
    price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!offerData.username.trim() || !offerData.price.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (isNaN(offerData.price) || offerData.price <= 0) {
      alert('유효한 가격을 입력해주세요.');
      return;
    }

    if (window.confirm('제안하시겠습니까?')) {
      onSubmit(offerData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>제안하기</h2>
        <div className="input-group">
          <label>사용자 이름</label>
          <input
            type="text"
            name="username"
            value={offerData.username}
            onChange={handleChange}
            placeholder="사용자 이름을 입력하세요"
          />
        </div>
        <div className="input-group">
          <label>제안 가격 (ETH)</label>
          <input
            type="number"
            name="price"
            value={offerData.price}
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
          <p>제안 가격: {offerData.expected_price} ETH</p>
          <p>제안자: {offerData.user_id}</p>
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

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/';

  axios.defaults.baseURL = API_BASE_URL;
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  const fetchEthPrice = async () => {
    try {
      const response = await axios.get('https://api.upbit.com/v1/ticker?markets=KRW-ETH');
      const price = Math.floor(response.data[0].trade_price);
      setEthPrice(price);
    } catch (err) {
      console.error('Error fetching ETH price:', err);
    }
  };

  const fetchItemDetail = async () => {
    try {
      const response = await axios.get(`/posts/${itemId}`);
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
  }, [itemId]);

  const handleBuy = () => {
    if (!ethPrice || !itemData?.post?.expected_price) {
      alert('가격 정보를 불러오는데 실패했습니다.');
      return;
    }

    const totalAmount = Math.floor(ethPrice * itemData.post.expected_price);

    const tossPayments = window.TossPayments("test_ck_PBal2vxj81P9lJQZP4wAr5RQgOAN");
    const payment = tossPayments.payment({customerKey: "test_ck_PBal2vxj81P9lJQZP4wAr5RQgOAN"});
    payment.requestPayment({
      method: "CARD",
      amount: {
        currency: "KRW",
        value: totalAmount,
      },
      orderId: "ZeHhA2Xpfgu1ilgSVTPe7",
      orderName: itemData.post.item_name,
      customerEmail: "customer123@gmail.com",
      customerName: "김토스",
      card: {
        useEscrow: false,
        flowMode: "DEFAULT",
        useCardPoint: false,
        useAppCardOnly: false,
      },
    })
    .then(async () => {
      try {
        await axios.post(`/posts/sold/${itemId}`, {
          sold_price: totalAmount
        });
        setIsPaymentSuccess(true);
        setIsPaymentModalOpen(true);
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

  const handleGoToList = () => {
    navigate('/explore');
  };

  const handleMakeOffer = () => {
    if (itemData.post.offer_accepted) {
      alert('이미 수락된 제안이 있습니다.');
      return;
    }
    setShowOfferModal(true);
  };

  const handleSubmitOffer = async (offerData) => {
    try {
      const response = await axios.post(`/offer/${itemId}`, {
        username: offerData.username,
        price: parseFloat(offerData.price)
      });
      
      const newOffer = response.data;
      setItemData(prevData => ({
        ...prevData,
        offers: [...(prevData.offers || []), newOffer]
      }));

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
      await axios.post(`/accept/${selectedOffer.id}`);
      
      setItemData(prevData => ({
        ...prevData,
        post: {
          ...prevData.post,
          offer_accepted: true
        },
        offers: prevData.offers.map(offer => 
          offer.id === selectedOffer.id 
            ? { ...offer, accepted: true }
            : offer
        )
      }));

      setShowAcceptModal(false);
      alert('제안이 성공적으로 수락되었습니다!');
    } catch (err) {
      alert('제안 수락 중 오류가 발생했습니다.');
      console.error('Error accepting offer:', err);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!itemData) return <div>아이템을 찾을 수 없습니다.</div>;

  return (
    <div className="container">
      <div className="content">
        <div className="item-image-container">
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
          <h1 className="item-title">{itemData.post.item_name}</h1>
          <p className="owner">Owned by {itemData.post.user_id}</p>
          <h2 className="item-price">- {itemData.post.expected_price} ETH</h2>
          
          <div className="description">
            <h3>Description</h3>
            <p>{itemData.post.description}</p>
          </div>

          <div className="action-buttons">
            <button 
              className="action-btn buy-btn" 
              onClick={handleBuy}
            >
              구매하기
            </button>
            <button 
              className="action-btn offer-btn" 
              onClick={handleMakeOffer}
              disabled={itemData.post.offer_accepted}
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

          <div className="offers">
            <h3>Offer 내역</h3>
            <div className="offers-list">
              {itemData.offers && itemData.offers.length > 0 ? (
                <div className="offers-header">
                  <span className="column-price">Price</span>
                  <span className="column-user">User</span>
                  <span className="column-date">Date</span>
                  <span className="column-action">Action</span>
                </div>
              ) : null}
              {itemData.offers && itemData.offers.length > 0 ? (
                itemData.offers.map(offer => (
                  <div key={offer.id} className="offer-item">
                    <span className="column-price">{offer.offer_price} ETH</span>
                    <span className="column-user">{offer.user_id}</span>
                    <span className="column-date">{offer.created_date}</span>
                    <span className="column-action">
                      {offer.accepted ? (
                        <span className="accepted-badge">수락됨</span>
                      ) : !itemData.post.offer_accepted ? (
                        <button
                          className="accept-btn"
                          onClick={() => handleAcceptOffer(offer)}
                        >
                          수락
                        </button>
                      ) : null}
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