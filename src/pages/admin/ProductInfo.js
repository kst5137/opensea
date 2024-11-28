import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductInfo() {
  const [productCount, setProductCount] = useState(0);
  const [topOwner, setTopOwner] = useState({ address: '', count: 0 });
  const [highestPriceNFT, setHighestPriceNFT] = useState({ name: '', price: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        const response = await axios.get('http://18.182.26.12/api/nfts');
        const nftList = response.data;
        
        // 전체 NFT 수 설정
        setProductCount(nftList.length);

        // owner별 NFT 보유 수량 계산
        const ownerCounts = nftList.reduce((acc, item) => {
          const owner = item.owner;
          acc[owner] = (acc[owner] || 0) + 1;
          return acc;
        }, {});

        // 가장 많은 NFT를 보유한 owner 찾기
        const topOwnerAddress = Object.entries(ownerCounts).reduce((top, [owner, count]) => {
          if (count > (top.count || 0)) {
            return { address: owner, count: count };
          }
          return top;
        }, { address: '', count: 0 });

        // 가장 높은 price를 가진 NFT 찾기
        const highestPriced = nftList.reduce((max, item) => {
          if (item.price > (max.price || 0)) {
            return {
              name: item.nft.name,
              price: item.price
            };
          }
          return max;
        }, { name: '', price: 0 });

        setTopOwner(topOwnerAddress);
        setHighestPriceNFT(highestPriced);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching NFT data:', err);
        setError('NFT 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchNFTData();
  }, []);

  if (loading) return <div className="info-card">로딩 중...</div>;
  if (error) return <div className="info-card">{error}</div>;

  return (
        <div className="info-card">
        <h3>NFT 정보</h3>
        <p>전체 NFT 수량: {productCount}</p>
        <p>최다보유자: <span className="highlight-address">{topOwner.address}</span></p>
        <p><span className="highlight-address">{topOwner.address}</span>의 NFTS 수량: {topOwner.count}</p>
        <p>최고가 NFT: <span className="highlight-name">{highestPriceNFT.name}</span></p>
        <p>최고 가격: {highestPriceNFT.price} ETH</p>
        </div>
  );
}

export default ProductInfo;