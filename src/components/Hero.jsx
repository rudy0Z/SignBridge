import React, { useState } from 'react';
import { ReactTyped } from 'react-typed';
import Camera from './Camera';

const Hero = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [showTextToSpeech, setShowTextToSpeech] = useState(false);
  const [text, setText] = useState('');

  const handleViewDemo = () => {
    setShowCamera(!showCamera);
  };

  const handleTextToSpeech = () => {
    setShowTextToSpeech(true);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleCloseModal = () => {
    setShowTextToSpeech(false);
    setText('');
  };

  return (
    <div className='text-white'>
      <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
        <p className='text-[#00df9a] font-bold p-2'>
          BRIDGING COMMUNICATION GAPS
        </p>
        <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>
          Connect through Sign Language.
        </h1>
        <div className='flex justify-center items-center'>
          <p className='md:text-5xl sm:text-4xl text-xl font-bold py-4'>
            Sign Language for
          </p>
          <ReactTyped
            className='md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2'
            strings={['everyone', 'everywhere', 'everyday']}
            typeSpeed={120}
            backSpeed={140}
            loop
          />
        </div>
        <p className='md:text-2xl text-xl font-bold text-gray-500'>
          Empowering the deaf and hard of hearing with technology that speaks their language.
        </p>
        <div className='flex justify-center'>
          <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-4 py-3 text-black'>
            Get Started
          </button>
          <button
            className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-4 py-3 text-black'
            onClick={handleViewDemo}
          >
            View Demo
          </button>
          <button
            className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-4 py-3 text-black'
            onClick={handleTextToSpeech}
          >
            Text to Speech
          </button>
        </div>
        {showCamera && <Camera />}
        {showTextToSpeech && (
          <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center'>
            <div className='bg-white p-8 rounded-lg'>
              <h2 className='text-2xl font-bold mb-4'>Text to Speech</h2>
              <textarea
                className='w-full h-32 p-2 border border-gray-300 rounded-md mb-4 text-black'
                value={text}
                onChange={handleTextChange}
                placeholder='Enter text here'
              />
              <div className='flex justify-end'>
                <button
                  className='bg-[#00df9a] text-white px-4 py-2 rounded-md mr-2'
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className='bg-[#00df9a] text-white px-4 py-2 rounded-md'
                  onClick={handleSpeech}
                >
                  Speak
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;