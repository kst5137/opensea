import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/MyNft.css";

export default function MyNftlist({userEmail}) {
    const [eventsCreated, setCreated] = useState([]);
    const [eventsOwned, setOwned] = useState([]);
    
    useEffect(() => {
        axios
            .get("http://18.182.26.12/api/nfts")
            .then(res => {
                const created = res.data.filter((nfts) => nfts.nft.compiler === userEmail);
                setCreated(created);

                const owned = res.data.filter((nfts) => nfts.owner === "testuser@test.com");
                setOwned(owned);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="nft-list flex flex-col gap-8">
  <div>
    <h2>내가 만든 NFT</h2>
    {eventsCreated.length === 0 && <li>등록된 NFT가 없습니다.</li>}
    {eventsCreated.length !== 0 && (
      <div className="grid grid-cols-3 gap-4">
        {eventsCreated.map((nfts, index) => (
          <div className="card" key={index}>
            <img
              src={nfts.nft.image || "/placeholder.jpg"}
              alt={nfts.nft.name || "NFT"}
              className="card-image object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
            <div className="card-content">
              <h3>{nfts.nft.name || "Unnamed NFT"}</h3>
              <p className="price" style={{ color: "#2081e2", fontWeight: "bold" }}>
                Price: {Number(nfts.price || 0).toFixed(2)} ETH
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

  <div>
    <h2>내가 소유한 NFT</h2>
    {eventsOwned.length === 0 && <li>등록된 NFT가 없습니다.</li>}
    {eventsOwned.length !== 0 && (
      <div className="grid grid-cols-3 gap-4">
        {eventsOwned.map((nfts, index) => (
          <div className="card" key={index}>
            <img
              src={nfts.nft.image || "/placeholder.jpg"}
              alt={nfts.nft.name || "NFT"}
              className="card-image object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
            <div className="card-content">
              <h3>{nfts.nft.name || "Unnamed NFT"}</h3>
              <p className="price" style={{ color: "#2081e2", fontWeight: "bold" }}>
                Price: {Number(nfts.price || 0).toFixed(2)} ETH
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div> 
    );

    //     <div className="nft-list">
    //         <h1>{userEmail}의 NFT 목록</h1>
    //         <hr />
    //         <h2>내가 만든 NFT</h2>
    //         <div className="row">
    //             {eventsCreated.length === 0 && <li>등록된 NFT가 없습니다.</li>}
    //             {eventsCreated.length !== 0 &&
    //                 eventsCreated.map((nfts, index) => (
    //                     <div className="col">
    //                         <div className="card">
    //                             <img src={nfts.nft.image} className="card-img-top" alt="..." />
    //                         <div className="card-body">
    //                             <h5 className="card-title">{nfts.nft.name}</h5>
    //                         </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //         </div>
    //         <hr />
    //         <h2>내가 소유한 NFT</h2>
    //         <div className="row">
    //             {eventsOwned.length === 0 && <li>등록된 NFT가 없습니다.</li>}
    //             {eventsOwned.length !== 0 &&
    //                 eventsOwned.map((nfts, index) => (
    //                     <div className="col">
    //                         <div className="card">
    //                             <img src={nfts.nft.image} className="card-img-top" alt="..." />
    //                         <div className="card-body">
    //                             <h5 className="card-title">{nfts.nft.name}</h5>
    //                         </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //         </div>
    //     </div>
    // );
}
