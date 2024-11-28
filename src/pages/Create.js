
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js"; // Import CryptoJS
import "./styles/Create.css";

function Create() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const imageFileInputRef = useRef(null);

  // New state variables for name and description
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user_email"));

  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/apng",
    "image/avif",
    "image/webp",
  ];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Function to generate DNA as a hash
  const generateDna = (name, description, imageUrl) => {
    const combinedString = `${name}-${description}-${imageUrl}-${Date.now()}`;
    const dna = CryptoJS.SHA256(combinedString).toString(CryptoJS.enc.Hex);
    return dna;
  };

  // 이미지 파일 변경 핸들러
  const handleChangeImgSrc = (target) => {
    const file = target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert(
          "파일 크기가 10MB를 초과합니다. 더 작은 이미지를 업로드해주세요.",
        );
        console.error("File size exceeds limit:", file.size);
        return;
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        alert(
          "유효하지 않은 이미지 유형입니다. 올바른 이미지 파일을 업로드해주세요.",
        );
        console.error("Invalid image type:", file.type);
        return;
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      console.log("Image file selected:", file);
      target.value = null;
    }
  };

  // Pre-signed URL 생성 함수
  const generatePresignedUrl = async (fileName, contentType) => {
    try {
      const queryParams = new URLSearchParams({
        file_name: fileName,
        content_type: contentType,
      }).toString();

      const url = `http://18.182.26.12/api/generate_presigned_url?${queryParams}`;

      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Pre-signed URL 생성에 실패했습니다.");
      }
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      throw error;
    }
  };

  // S3에 이미지 업로드 함수
  const uploadImageToS3 = async (file, url) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(
          `업로드 실패: ${response.status} ${response.statusText}`,
        );
      }

      const parsedUrl = new URL(url);
      const bucketName = "sesac-nft-image"; // Replace with your actual bucket name
      const region = "ap-northeast-1"; // Replace with your actual region

      const objectKey = parsedUrl.pathname.replace(`/${bucketName}/`, "");

      const uploadedFileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${objectKey}`;

      return uploadedFileUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // 트랜잭션 생성 함수
  const createTransaction = async (metadata) => {
    try {
      const requestBody = JSON.stringify(metadata);

      const response = await fetch(
        "http://18.182.26.12/api/broadcast_transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        },
      );

      if (!response.ok) {
        throw new Error("트랜잭션 생성에 실패했습니다.");
      }
      const data = await response.json();
      console.log("Transaction created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  };

  // NFT 생성 함수
  const createNft = async () => {
    if (!selectedImage) {
      console.error("이미지가 선택되지 않았습니다.");
      alert("이미지를 업로드해주세요.");
      return;
    }

    // Validate name and description
    if (!name.trim() || !description.trim()) {
      alert("이름과 설명을 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      console.log("Pre-signed URL 생성 중...");
      const presignedUrl = await generatePresignedUrl(
        selectedImage.name,
        selectedImage.type,
      );

      console.log("이미지를 S3에 업로드 중...");
      const imageUrl = await uploadImageToS3(selectedImage, presignedUrl);

      const dna = generateDna(name, description, imageUrl);

      const nftMetadata = {
        name, // Use the name from input
        description, // Use the description from input
        image: imageUrl,
        dna, // Generated DNA
        edition: 1, // Always 1
        date: Date.now(), // Current timestamp
        compiler: user,
      };

      const transaction = {
        sender: "SYSTEM", // Replace with actual sender address
        receiver: user, // Replace with actual receiver address
        nft: nftMetadata,
        price: price, // Set the price as needed
        timestamp: new Date().toISOString(),
      };

      console.log("트랜잭션 데이터:", transaction);

      await createTransaction(transaction);

      // Reset all fields
      setImagePreview(null);
      setSelectedImage(null);
      setName("");
      setDescription("");

      alert("NFT와 트랜잭션이 성공적으로 생성되었습니다!");

      // Uncomment and adjust navigation as needed
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("NFT 생성 중 오류 발생:", error);
      alert("NFT 생성 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 이미지 드래그 이벤트 핸들러
  const handleImageDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(true);
  };

  const handleImageDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleImageDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleChangeImgSrc({ files: e.dataTransfer.files });
    }
  };

  return (
    <div className="Create">
      <div className={token ? "hidden" : ""}>
        <div className="alert alert-danger" role="alert">
          먼저 로그인을 해주세요.
        </div>
      </div>
      <div className={!token ? "hidden" : "createContainer"}>
        {loading && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h2 className="modalText">Uploading...</h2>
            </div>
          </div>
        )}
        <h2>Create New Item</h2>
        <p>Turn your image and metadata into extraordinary NFTs.</p>

        <div className="uploadContainer">
          {/* 이미지 업로드 영역 */}
          <div
            className={`uploadArea ${isDraggingImage ? "dragging" : ""}`}
            onClick={() => imageFileInputRef.current?.click()}
            onDragEnter={handleImageDragEnter}
            onDragOver={handleImageDragOver}
            onDragLeave={handleImageDragLeave}
            onDrop={handleImageDrop}
          >
            {!imagePreview ? (
              <p className="uploadText">
                Drag and drop media
                <br />
                <span
                  className="browseTextContainer"
                  onClick={(e) => {
                    e.stopPropagation();
                    imageFileInputRef.current.click();
                  }}
                >
                  <span className="browseText">Browse files</span>
                  <input
                    ref={imageFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChangeImgSrc(e.target)}
                    className="fileInput"
                  />
                </span>
              </p>
            ) : (
              <div className="uploadPreview">
                <img
                  src={imagePreview}
                  alt="Uploaded preview"
                  className="previewImage"
                />
              </div>
            )}
          </div>

          {/* 새로운 메타데이터 입력 필드 */}
          <div className="metadataContainer">
            <h4>Metadata</h4>
            <div className="inputGroup">
              <label htmlFor="nftName">Name:</label>
              <input
                type="text"
                id="nftName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter NFT name"
                className="textInput"
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="nftPrice">Price:</label>
              <input
                type="text"
                id="nftPrice"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter NFT price"
                className="textInput"
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="nftDescription">Description:</label>
              <textarea
                id="nftDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter NFT description"
                className="textareaInput"
              />
            </div>
          </div>
        </div>

        <div className="buttonContainer">
          <button className="button createButton" onClick={createNft}>
            Create NFT
          </button>
          <button
            className="button cancelButton"
            onClick={() => {
              setImagePreview(null);
              setSelectedImage(null);
              setName("");
              setDescription("");
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default Create;
