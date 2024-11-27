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

                const owned = res.data.filter((nfts) => nfts.owner === "receiver-address");
                setOwned(owned);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="nft-list">
            <h1>{userEmail}의 NFT 목록</h1>
            <hr />
            <h2>내가 만든 NFT</h2>
            <div className="row">
                {eventsCreated.length === 0 && <li>등록된 NFT가 없습니다.</li>}
                {eventsCreated.length !== 0 &&
                    eventsCreated.map((nfts, index) => (
                        <div className="col">
                            <div className="card">
                                <img src={nfts.nft.image} className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{nfts.nft.name}</h5>
                            </div>
                            </div>
                        </div>
                    ))}
            </div>
            <hr />
            <h2>내가 소유한 NFT</h2>
            <div className="row">
                {eventsOwned.length === 0 && <li>등록된 NFT가 없습니다.</li>}
                {eventsOwned.length !== 0 &&
                    eventsOwned.map((nfts, index) => (
                        <div className="col">
                            <div className="card">
                                <img src={nfts.nft.image} className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{nfts.nft.name}</h5>
                            </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
