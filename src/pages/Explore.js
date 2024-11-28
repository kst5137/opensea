import { React, useState, useEffect } from 'react';
import "./styles/Explore.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://18.182.26.12/api";


function Explore(){
  const Card = ({ nft, onClick }) => {
    const getNFTName = () => {
      const name = nft?.nft?.name;
      if (!name || name === "Unnamed NFT" || name.trim() === "") {
        return `NFT #${nft?.nft?.edition || "Unknown"}`;
      }
      return name;
    };
    
    return (
        <div className="card" onClick={onClick}>
        <img 
            src={nft?.nft?.image || "/placeholder.jpg"} 
            alt={nft?.nft?.name || "NFT"} 
            className="card-image"
            onError={(e) => {e.target.src = "/placeholder.jpg"}}
        />
        <div className="card-content">
            <h3>{nft?.nft?.name || "Unnamed NFT"}</h3>
            <p className="price" style={{ color: '#2081e2', fontWeight: 'bold' }}>
            Price: {Number(nft?.price || 0).toFixed(2)} ETH
            </p>
        </div>
        </div>
        );
    };



    const navigate = useNavigate();
    const [allNFTs, setAllNFTs] = useState([]);
    const [displayedNFTs, setDisplayedNFTs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const postsPerPage = 8;
  
    useEffect(() => {
      const fetchNFTs = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/nfts`);
          if (!response.ok) throw new Error("Failed to fetch NFTs");
          const data = await response.json();
          
          const sortedData = [...data].sort((a, b) => {
            const dateA = a?.nft?.date || 0;
            const dateB = b?.nft?.date || 0;
            return dateB - dateA;
          });
          
          console.log("Fetched NFTs:", sortedData);
          setAllNFTs(sortedData);
          setDisplayedNFTs(sortedData);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchNFTs();
    }, []);
  
    const handleSearch = () => {
      if (!search.trim()) {
        setDisplayedNFTs(allNFTs);
        return;
      }
  
      const searchTerm = search.trim().toLowerCase();
      let filtered = allNFTs;
  
      switch (searchType) {
        case "title":
          filtered = allNFTs.filter(nft => 
            nft?.nft?.name?.toLowerCase().includes(searchTerm)
          );
          break;
        case "compiler":
          filtered = allNFTs.filter(nft => 
            nft?.nft?.compiler?.toLowerCase().includes(searchTerm)
          );
          break;
        default:
          filtered = allNFTs.filter(nft => 
            nft?.nft?.name?.toLowerCase().includes(searchTerm) ||
            nft?.nft?.compiler?.toLowerCase().includes(searchTerm)
          );
      }
  
  
      setDisplayedNFTs(filtered);
      setCurrentPage(1);
    };
  
    const handleClearSearch = () => {
      setSearch("");
      setDisplayedNFTs(allNFTs);
      setCurrentPage(1);
    };
  
    const handlePostClick = (nft) => {
      navigate(`/posts/${nft?.post?.id}`);
    };
  
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = displayedNFTs.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(displayedNFTs.length / postsPerPage);
  
    return (
      <>
        <div className="explore">
          <main>
            <h1>Explore</h1>
            <div className="search-bar">
              <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
                className="search-type"
              >
                <option value="all">All</option>
                <option value="title">Title</option>
                <option value="compiler">Creator</option>
              </select>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search by ${searchType}`}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="search-button"
              >
                Search
              </button>
              {search && (
                <button 
                  onClick={handleClearSearch}
                  className="clear-button"
                >
                  Clear
                </button>
              )}
            </div>
  
            {!isLoading && search && (
              <p>Found {displayedNFTs.length} results</p>
            )}
  
          <div className="grid">
            {isLoading ? (
              <p>Loading...</p>
            ) : currentPosts.length > 0 ? (
              currentPosts.map((nft) => (
                <Card 
                  key={nft?.nft?.dna || Math.random().toString()}
                  nft={nft}
                  onClick={() => handlePostClick(nft)}
                />
              ))
            ) : (
              <p>No NFTs found</p>
            )}
          </div>
  
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="page-button"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, idx) => {
                if (
                  idx + 1 === 1 ||
                  idx + 1 === totalPages ||
                  Math.abs(currentPage - (idx + 1)) <= 2
                ) {
                  return (
                    <button
                      key={idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={currentPage === idx + 1 ? 'page-button active' : 'page-button'}
                    >
                      {idx + 1}
                    </button>
                  );
                } else if (
                  idx + 1 === currentPage - 3 || 
                  idx + 1 === currentPage + 3
                ) {
                  
                  return <span key={idx + 1} className="pagination-ellipsis">...</span>;
                }
                return null;
              })}
              <button 
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="page-button"
              >
                &gt;
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
export default Explore;
