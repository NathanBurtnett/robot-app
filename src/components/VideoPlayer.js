import React, { useRef, useEffect } from "react";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadOpencv = async () => {
      await window.loadOpenCV();
    };
    loadOpencv();
  }, []);

  useEffect(() => {
    if (typeof window.cv === "undefined") {
      return;
    }

    const videoSrc = "http://192.168.0.30/stream";
    videoRef.current.src = videoSrc;

    const detectFaces = () => {
      const videoMat = new window.cv.Mat(videoRef.current.height, videoRef.current.width, window.cv.CV_8UC4);
      const canvasMat = window.cv.imread(videoRef.current);
      const grayMat = new window.cv.Mat(videoRef.current.height, videoRef.current.width, window.cv.CV_8UC1);
      const faces = new window.cv.RectVector();
      const classifier = new window.cv.CascadeClassifier();

      classifier.load("data/haarcascade_frontalface_default.xml");

      window.cv.cvtColor(canvasMat, grayMat, window.cv.COLOR_RGBA2GRAY);
      classifier.detectMultiScale(grayMat, faces, 1.1, 3, 0, new window.cv.Size(30, 30), new window.cv.Size(500, 500));

      for (let i = 0; i < faces.size(); ++i) {
        let face = faces.get(i);
        let point1 = new window.cv.Point(face.x, face.y);
        let point2 = new window.cv.Point(face.x + face.width, face.y + face.height);
        window.cv.rectangle(canvasMat, point1, point2, [255, 0, 0, 255]);
      }

      window.cv.imshow(canvasRef.current, canvasMat);
      requestAnimationFrame(detectFaces);

      videoMat.delete();
      canvasMat.delete();
      grayMat.delete();
      faces.delete();
      classifier.delete();
    };

    videoRef.current.onloadedmetadata = () => {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      requestAnimationFrame(detectFaces);
    };
  }, [window.cv]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted playsInline style={{ display: "none" }} />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default VideoPlayer;
