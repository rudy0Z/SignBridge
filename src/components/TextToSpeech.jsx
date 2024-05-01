import React, { useState } from 'react';

const TextToSpeechPage = () => {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white z-50 flex items-center justify-center">
      <div className="bg-gray-200 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Text to Speech</h2>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded-md mb-4"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text here"
        />
        <button
          className="bg-[#00df9a] text-white px-4 py-2 rounded-md"
          onClick={handleSpeech}
        >
          Speak
        </button>
      </div>
    </div>
  );
};

export default TextToSpeechPage;