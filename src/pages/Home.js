import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import "./styles/Home.css";

const API_BASE_URL = "http://18.182.26.12/api";



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
		  const response = await fetch(`${API_BASE_URL}/transactions`);
		  
		  if (!response.ok) {
			throw new Error("Failed to fetch data");
		  }
  
		  const data = await response.json();
		  console.log("Fetched NFTs:", data);
  
		  // 가격 기준으로 정렬하여 상위 10개 추출 (랭킹)
		  const sortedByPrice = [...data].sort((a, b) => 
			Number(b?.price || 0) - Number(a?.price || 0)
		  ).slice(0, 10);
  
		  // 날짜 기준으로 정렬하여 최신 8개 추출 (최신 포스트)
		  const sortedByDate = [...data].sort((a, b) => 
			Number(b?.nft?.date || 0) - Number(a?.nft?.date || 0)
		  ).slice(0, 8);
  
		  setRankingItems(sortedByPrice);
		  setRecentPosts(sortedByDate);
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
	  if (nft?.nft?.dna) {
		navigate(`/post/${nft.nft.dna}`);
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
					key={`ranking-${idx}-${nft?.nft?.dna || Math.random()}`}
					className="card"
					onClick={() => handleNFTClick(nft)}
				  >
					<div className="thumbnail">
					  <img 
						src={nft?.nft?.image || "/placeholder.jpg"} 
						alt={nft?.nft?.name || "NFT"}
						onError={(e) => {e.target.src = "/placeholder.jpg"}}
					  />
					</div>
					<div className="details">
					  <h3>{nft?.nft?.name || "Unnamed NFT"}</h3>
					  <p className="price" style={{ color: '#2081e2', fontWeight: 'bold' }}>
						Price: {Number(nft?.price || 0).toFixed(2)} ETH
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
		  <section className="post-section">
			<h2 className="section-title">Post</h2>
			<div className="grid">
			  {recentPosts.map((nft, idx) => (
				<div 
				  key={`post-${idx}-${nft?.nft?.dna || Math.random()}`}
				  className="card"
				  onClick={() => handleNFTClick(nft)}
				>
				  <div className="thumbnail">
					<img 
					  src={nft?.nft?.image || "/placeholder.jpg"} 
					  alt={nft?.nft?.name || "NFT"}
					  onError={(e) => {e.target.src = "/placeholder.jpg"}}
					/>
				  </div>
				  <div className="details">
					<h3>{nft?.nft?.name || "Unnamed NFT"}</h3>
					<p className="price" style={{ color: '#2081e2', fontWeight: 'bold' }}>
					  Price: {Number(nft?.price || 0).toFixed(2)} ETH
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

// const Home = () => {
// 	return (
// 		<div className='home-container'>
// 			<div className='home-title-section'>
// 				<div className='home-title-area'>
// 					<h1 className='home-title'>Welcome to LeeSea!<br></br>Discover, collect, and sell extraordinary NFTs</h1>
// 					<h3 className='home-description'>LeeSea가 만든 NFT마켓에 지금 참여하세요.</h3>
// 				</div>
// 				<div className='home-btn-area'>
// 					<Link to="/BEB-05-LeeSea/explore"><button type="button" className="home-btn go-to-explore">Explore</button></Link>
// 					<Link to="/BEB-05-LeeSea/create"><button type="button" className="home-btn go-to-create">Create</button></Link>
// 				</div>
// 			</div>
// 			<div className="home-title-image" >
// 				<img className='image-item' src="https://cdn.pixabay.com/photo/2016/07/11/11/48/printing-on-t-shirt-1509512_1280.png" width="100%" height="100%" alt='...'></img>
// 				<img className='image-item' src="https://cdn.pixabay.com/photo/2016/09/12/05/41/van-gogh-1663090_1280.jpg" width="100%" height="100%" alt='...'></img>
// 				<img className='image-item' src="https://cdn.pixabay.com/photo/2020/06/06/11/48/caricature-5266261_1280.jpg" width="100%" height="100%" alt='...'></img>
// 				<img className='image-item' src="https://cdn.pixabay.com/photo/2018/03/20/10/04/illustrator-3242713_1280.jpg" width="100%" height="100%" alt='...'></img>
// 				<img className='image-item' src="https://cdn.pixabay.com/photo/2017/03/19/15/14/happiness-2156794_1280.png" width="100%" height="100%" alt='...'></img>
// 				<img className='image-item' src="https://cdn.pixabay.com/photo/2018/04/09/19/55/low-poly-3305284_1280.jpg" width="100%" height="100%" alt='...'></img>
// 				<img className='image-item' src="https://cdn.pixabay.com/photo/2020/05/19/13/48/cartoon-5190942_1280.jpg" width="100%" height="100%" alt='...'></img>
// 				<img className='image-item' src="https://cdn.pixabay.com/photo/2020/06/10/02/22/caricature-5280770_1280.jpg" width="100%" height="100%" alt='...'></img>
// 			</div>
// 			{/* <img className="home-title-image" src="" width="100%" height="100%" alt='...'></img> */}			
// 		</div>
// 	);

// }


// export default Home;
