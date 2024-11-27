import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

const API_BASE_URL = "http://127.0.0.1:8000/posts";

const Home = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentLikeIndex, setCurrentLikeIndex] = useState(0);
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
          <h2 className="section-title">Price Ranking</h2>
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
                      src={nft?.img_url || "/placeholder.jpg"} 
                      alt={nft?.item_name || "NFT"}
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div className="details">
                    <h3>{nft?.item_name || "Unnamed NFT"}</h3>
                    <p className="price" style={{ color: "#2081e2", fontWeight: "bold" }}>
                      Price: {Number(nft?.sold_price || 0).toFixed(2)} ETH
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

        {/* Like Ranking Section */}
		<section className="ranking-section">
			<h2 className="section-title">Like Ranking</h2>
			<div className="slider-container">
				<button
					className="arrow left-arrow"
					onClick={handlePrev}
					disabled={currentLikeIndex === 0}
				>
					◀
				</button>
				<div className="slider">
					{likeRankingItems.slice(currentLikeIndex, currentLikeIndex + 5).map((nft, idx) => (
					<div
						key={`like-ranking-${idx}-${nft?.id || Math.random()}`}
						className="card"
						onClick={() => handleNFTClick(nft)}
					>
						<div className="thumbnail">
						<img
							src={nft?.img_url || "/placeholder.jpg"} 
							alt={nft?.item_name || "NFT"}
							onError={(e) => { e.target.src = "/placeholder.jpg"; }}
						/>
						</div>
						<div className="details">
						<h3>{nft?.item_name || "Unnamed NFT"}</h3>
						<p className="likes" style={{ color: "#2081e2", fontWeight: "bold" }}>
							Likes: {nft?.like_count || 0}
						</p>
						</div>
					</div>
					))}
				</div>
				<button
					className="arrow right-arrow"
					onClick={handleNext}
					disabled={currentLikeIndex + 5 >= likeRankingItems.length}
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
                    src={nft?.img_url || "/placeholder.jpg"}
                    alt={nft?.item_name || "NFT"} 
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </div>
                <div className="details">
                  <h3>{nft?.item_name || "Unnamed NFT"}</h3>
                  <p className="price" style={{ color: "#2081e2", fontWeight: "bold" }}>
                    Price: {Number(nft?.sold_price || 0).toFixed(2)} ETH
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
