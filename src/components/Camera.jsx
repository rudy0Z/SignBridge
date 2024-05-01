import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Holistic } from '@mediapipe/holistic';

function Camera() {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [gesture, setGesture] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const threshold = 0.8;
  const actions = ['How are you'];
  const [noLandmarksDetected, setNoLandmarksDetected] = useState(false);
  const [isDetectingGesture, setIsDetectingGesture] = useState(false);

  const startVideo = () => {
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(interval);
          initiateVideoStream();
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const initiateVideoStream = async () => {
    const video = videoRef.current;
    if (video) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.play();
      setIsPlaying(true);
    }
  };

  const speakGesture = (gesture) => {
    const utterance = new SpeechSynthesisUtterance(gesture);
    window.speechSynthesis.speak(utterance);
  };

  // Load the model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('./model.json');
        setModel(loadedModel);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Failed to load model', error);
      }
    };
    loadModel();
  }, []);

  // Access camera and predict gestures
  useEffect(() => {
    let holistic;
    let detectionInterval;

    const runMediaPipe = async () => {
      const video = videoRef.current;
      holistic = new Holistic({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        },
      });

      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      holistic.onResults(onResults);

      if (video && isPlaying) {
        await holistic.send({ image: video });
        detectionInterval = setInterval(async () => {
          await holistic.send({ image: video });
        }, 5000); // Detect landmarks every 5 seconds
      }
    };

    if (isPlaying) {
      runMediaPipe();
    }

    return () => {
      if (holistic) {
        holistic.close();
      }
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [model, isPlaying]);

  const onResults = async (results) => {
    console.log('onResults called');
    setIsDetectingGesture(true);

    if (
      results.poseLandmarks &&
      results.faceLandmarks &&
      results.leftHandLandmarks &&
      results.rightHandLandmarks
    ) {
      console.log('All landmarks detected');
      setNoLandmarksDetected(false);
      const keypoints = extractKeypoints(results);
      await makePrediction(keypoints);
    } else {
      console.log('Missing landmarks');
      setNoLandmarksDetected(true);
      setGesture('');
    }

    setIsDetectingGesture(false);
  };

  const makePrediction = async (keypoints) => {
    console.log('Making prediction...');
    console.log('Keypoints:', keypoints);
    const numFrames = 30; // Number of frames in the sequence
    const keypointsSequence = Array(numFrames).fill(keypoints);
    const processedInput = tf.tensor(keypointsSequence).expandDims();
    const predictions = await model.predict(processedInput);
    const predictedIndex = predictions.argMax(-1).dataSync()[0];
    const predictedGesture = actions[predictedIndex];
    const probability = predictions.dataSync()[predictedIndex];
  
    console.log('Predicted gesture:', predictedGesture);
    console.log('Probability:', probability);
    console.log('Predictions:');
    predictions.print();
  
    if (predictedGesture === 'How are you' && probability > threshold) {
      setGesture(predictedGesture);
      speakGesture(predictedGesture);
    } else {
      setGesture('');
    }
  };

  const extractKeypoints = (results) => {
    if (!results) {
      return Array(1662).fill(0);
    }
  
    const pose = results.poseLandmarks
      ? results.poseLandmarks.map((landmark) => [landmark.x, landmark.y, landmark.z, landmark.visibility]).flat()
      : Array(33 * 4).fill(0);
    const face = results.faceLandmarks
      ? results.faceLandmarks.map((landmark) => [landmark.x, landmark.y, landmark.z]).flat()
      : Array(468 * 3).fill(0);
    const lh = results.leftHandLandmarks
      ? results.leftHandLandmarks.map((landmark) => [landmark.x, landmark.y, landmark.z]).flat()
      : Array(21 * 3).fill(0);
    const rh = results.rightHandLandmarks
      ? results.rightHandLandmarks.map((landmark) => [landmark.x, landmark.y, landmark.z]).flat()
      : Array(21 * 3).fill(0);
  
    return [...pose, ...face, ...lh, ...rh];
  };

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay playsInline />
      {!isPlaying && <button onClick={startVideo}>Start Video</button>}
      {gesture && <p>Detected gesture: {gesture}</p>}
      {noLandmarksDetected && (
        <p>No landmarks detected. Please start doing gestures.</p>
      )}
      {isDetectingGesture && (
        <div>
          <p>Detecting gesture...</p>
          {/* You can add an animated loading component here */}
        </div>
      )}
    </div>
  );
}

export default Camera;