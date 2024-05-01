import React, { useState } from 'react';

const OTPModal = ({ onOTPSubmit, onClose }) => {
  const [otp, setOTP] = useState('');

  const handleOTPSubmit = () => {
    onOTPSubmit(otp);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            placeholder="Enter OTP"
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
          />
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleOTPSubmit}
              className="bg-[#00df9a] text-white rounded-md px-4 py-2"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;