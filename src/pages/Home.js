import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

const API_BASE_URL = "http://127.0.0.1:8000/posts";

const Home = () => {
  const [priceIndex, setPriceIndex] = useState(0);
  const [likeIndex, setLikeIndex] = useState(0);
  const [rankingItems, setRankingItems] = useState([]);
  const [likeRankingItems, setLikeRankingItems] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [rankingResponse, recentResponse, likeRankingResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/ranking`),
          fetch(`${API_BASE_URL}/recent-posts`),
          fetch(`${API_BASE_URL}/like-ranking`)
        ]);

        const [rankingData, recentData, likeRankingData] = await Promise.all([
          rankingResponse.json(),
          recentResponse.json(),
          likeRankingResponse.json()
        ]);

        setRankingItems(rankingData);
        setRecentPosts(recentData);
        setLikeRankingItems(likeRankingData);
      } catch (error) {
        console.error("Error:", error);
        setRankingItems([]);
        setRecentPosts([]);
        setLikeRankingItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePricePrev = () => {
    if (priceIndex > 0) {
      setPriceIndex((prevIndex) => prevIndex - 5);
    }
  };

  const handlePriceNext = () => {
    if (priceIndex + 3 < rankingItems.length) {
      setPriceIndex((prevIndex) => prevIndex + 5);
    }
  };

  const handleLikePrev = () => {
    if (likeIndex > 0) {
      setLikeIndex((prevIndex) => prevIndex - 5);
    }
  };

  const handleLikeNext = () => {
    if (likeIndex + 3 < likeRankingItems.length) {
      setLikeIndex((prevIndex) => prevIndex + 5);
    }
  };

  const handleNFTClick = (nft) => {
    if (nft?.id) {
      navigate(`/posts/${nft.id}`);
    }
  };

  const ImageOrNoImage = ({ src, alt }) => {
    const [hasError, setHasError] = useState(!src);

    return hasError ? (
      <div className="no-image-container">
        <span className="no-image-text">No Image</span>
      </div>
    ) : (
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
      />
    );
  };

  if (isLoading) {
    return (
      <>
        <main className="page-main-content">
          <h1 className="page-title">Welcome to our openSea</h1>
          <p>Loading...</p>
        </main>
      </>
    );
  }

  return (
    <div className="home">
      <main className="page-main-content">
        <h1 className="page-title">Welcome to our openSea</h1>
        
        {/* Price Ranking Section */}
        <section className="ranking-section">
          <h2 className="ranking-title">Price Ranking</h2>
          <div className="slider-container">
            <button
              className="arrow left-arrow"
              onClick={handlePricePrev}
              disabled={priceIndex === 0}
            >
              ◀
            </button>
            <div className="slider">
              {rankingItems.slice(priceIndex, priceIndex + 5).map((nft, idx) => (
                <div
                  key={`ranking-${idx}-${nft?.id || Math.random()}`}
                  className="card"
                  onClick={() => handleNFTClick(nft)}
                >
                  <div className="thumbnail">
                    <ImageOrNoImage
                      src={nft?.img_url}
                      alt={nft?.item_name || "NFT"}
                    />
                  </div>
                  <div className="details">
                    <h3>{nft?.item_name || "Unnamed NFT"}</h3>
                    <p className="price" style={{ color: "#2081e2", fontWeight: "bold" }}>
                      Price: {Number(nft?.sold_price || 0).toString()} ETH
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="arrow right-arrow"
              onClick={handlePriceNext}
              disabled={priceIndex + 5 >= rankingItems.length}
            >
              ▶
            </button>
          </div>
        </section>

        {/* Like Ranking Section */}
        <section className="ranking-section">
          <h2 className="ranking-title">Likes Ranking</h2>
          <div className="slider-container">
            <button
              className="arrow left-arrow"
              onClick={handleLikePrev}
              disabled={likeIndex === 0}
            >
              ◀
            </button>
            <div className="slider">
              {likeRankingItems.slice(likeIndex, likeIndex + 5).map((nft, idx) => (
                <div
                  key={`like-ranking-${idx}-${nft?.id || Math.random()}`}
                  className="card"
                  onClick={() => handleNFTClick(nft)}
                >
                  <div className="thumbnail">
                    <ImageOrNoImage
                      src={nft?.img_url}
                      alt={nft?.item_name || "NFT"}
                    />
                  </div>
                  <div className="details">
                    <h3>{nft?.item_name || "Unnamed NFT"}</h3>
                    <p className="likes" style={{ color: "#2081e2", fontWeight: "bold" }}>
                      ❤️Likes: {nft?.like_count || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="arrow right-arrow"
              onClick={handleLikeNext}
              disabled={likeIndex + 5 >= likeRankingItems.length}
            >
              ▶
            </button>
          </div>
        </section>

        {/* Recent Posts Section */}
        <section className="post-section">
          <h2 className="ranking-title">Recent Posts</h2>
          <div className="grid">
            {recentPosts.map((nft, idx) => (
              <div 
                key={`post-${idx}-${nft?.id || Math.random()}`} 
                className="card"
                onClick={() => handleNFTClick(nft)}
              >
                <div className="thumbnail">
                  <ImageOrNoImage
                    src={nft?.img_url}
                    alt={nft?.item_name || "NFT"}
                  />
                </div>
                <div className="details">
                  <h3>{nft?.item_name || "Unnamed NFT"}</h3>
                  <p className="price" style={{ color: "#2081e2", fontWeight: "bold", margin: 3 }}>
                    Price: {Number(nft?.sold_price || 0).toString()} ETH
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