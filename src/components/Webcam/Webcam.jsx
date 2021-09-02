import React, { useState } from "react";
import Webcam from "react-webcam";

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: "user",
};

export const WebcamCapture = () => {
  const [image, setImage] = useState("");
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    // console.log(imageSrc)
    setImage(imageSrc);
    downloadImage(imageSrc);
  }, [webcamRef]);

  async function downloadImage(imageSrc) {
    const image = await fetch(imageSrc);
    const imageBlob = await image.blob();
    const file = new File([imageBlob], "myFile.png", { type: imageBlob.type });
    uploadImageToDir(file);
  }

  const uploadImageToDir = (photo) => {
    // console.log(JSON.stringify({myImg:photo}))
    const formData = new FormData();
    formData.append("myImg", photo);
    fetch("http://localhost:4000/uploadForm", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  return (
    <div className="webcam-container">
      <div className="webcam-img">
        {image == "" ? (
          <Webcam
            audio={false}
            height={200}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={220}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image} />
        )}
      </div>
      <div>
        {image != "" ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              setImage("");
            }}
            className="webcam-btn"
          >
            Retake Image
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
            className="webcam-btn"
          >
            Capture
          </button>
        )}
      </div>
    </div>
  );
};
