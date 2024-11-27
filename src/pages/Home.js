import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

const API_BASE_URL = "http://127.0.0.1:8000";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rankingItems, setRankingItems] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 상위 10개 랭킹 데이터 가져오기
        const rankingResponse = await fetch(`${API_BASE_URL}/ranking`);
        if (!rankingResponse.ok) {
          throw new Error("Failed to fetch ranking data");
        }
        const rankingData = await rankingResponse.json();

        // 최신 8개 포스트 데이터 가져오기
        const recentResponse = await fetch(`${API_BASE_URL}/recent-posts`);
        if (!recentResponse.ok) {
          throw new Error("Failed to fetch recent posts data");
        }
        const recentData = await recentResponse.json();

        // 상태 업데이트
        setRankingItems(rankingData);
        setRecentPosts(recentData);

        // 데이터 확인용 로그
        console.log("Ranking Data:", rankingData);
        console.log("Recent Posts Data:", recentData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRankingItems([]);
        setRecentPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 5);
    }
  };

  const handleNext = () => {
    if (currentIndex + 5 < rankingItems.length) {
      setCurrentIndex((prevIndex) => prevIndex + 5);
    }
  };

  const handleNFTClick = (nft) => {
    if (nft?.id) {
      navigate(`/posts/${nft.id}`);
    }
  };

  if (isLoading) {
    return (
      <>
        <main className="main-content">
          <h1 className="main-title">Welcome to our openSea</h1>
          <p>Loading...</p>
        </main>
      </>
    );
  }

  return (
    <div className="home">
      <main className="main-content">
        <h1 className="main-title">Welcome to our openSea</h1>
        
        {/* Ranking Section */}
        <section className="ranking-section">
          <h2 className="section-title">Ranking</h2>
          <div className="slider-container">
            <button
              className="arrow left-arrow"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ◀
            </button>
            <div className="slider">
              {rankingItems.slice(currentIndex, currentIndex + 5).map((nft, idx) => (
                <div
                  key={`ranking-${idx}-${nft?.id || Math.random()}`}
                  className="card"
                  onClick={() => handleNFTClick(nft)}
                >
                  <div className="thumbnail">
                    <img
                      src={nft?.img_url || "/placeholder.jpg"} // FastAPI img_url 필드 사용
                      alt={nft?.item_name || "NFT"} // FastAPI item_name 필드 사용
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg"; // 이미지 로드 실패 시 대체 이미지
                      }}
                    />
                  </div>
                  <div className="details">
                    <h3>{nft?.item_name || "Unnamed NFT"}</h3>
                    <p className="price" style={{ color: "#2081e2", fontWeight: "bold" }}>
                      Price: {Number(nft?.expected_price || 0).toFixed(2)} ETH
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="arrow right-arrow"
              onClick={handleNext}
              disabled={currentIndex + 5 >= rankingItems.length}
            >
              ▶
            </button>
          </div>
        </section>
        
        {/* Recent Posts Section */}
        <section className="post-section">
          <h2 className="section-title">Recent Posts</h2>
          <div className="grid">
            {recentPosts.map((nft, idx) => (
              <div 
                key={`post-${idx}-${nft?.id || Math.random()}`} 
                className="card"
              >
                <div className="thumbnail">
                  <img
                    src={nft?.img_url || "/placeholder.jpg"} // FastAPI img_url 필드 사용
                    alt={nft?.item_name || "NFT"} // FastAPI item_name 필드 사용
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg"; // 이미지 로드 실패 시 대체 이미지
                    }}
                  />
                </div>
                <div className="details">
                  <h3>{nft?.item_name || "Unnamed NFT"}</h3>
                  <p className="price" style={{ color: "#2081e2", fontWeight: "bold" }}>
                    Price: {Number(nft?.expected_price || 0).toFixed(2)} ETH
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
