import React, { useState } from 'react';
import BasicPlanIcon from '../assets/single.png';
import ProPlanIcon from '../assets/double.png';
import axios from 'axios';

const Cards = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);

  const handleBuyNow = async (plan) => {
    setLoading(true);
    setShowOTPInput(false);  // Ensure this is reset in case of multiple clicks or errors
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User is not authenticated');
        setLoading(false);
        return;
      }
  
      const { data } = await axios.post('http://localhost:5000/api/auth/send-otp', { amount: plan.price }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      setShowOTPInput(true);
      setLoading(false);  // Ensure loading is handled correctly
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  

  const handleOTPSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User is not authenticated');
        setLoading(false);
        return;
      }

      // Verify the OTP on the server
      const { data } = await axios.post('http://localhost:5000/api/auth/verify-otp', { otp }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (data.isValid) {
        // OTP is correct, proceed with creating the Razorpay order
        const orderData = await axios.post('http://localhost:5000/api/auth/create-order', { amount: 299 }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setOrder(orderData.data);
        setShowOTPInput(false);

        // Open the Razorpay payment modal
        const options = {
          key: 'rzp_test_ISFZvpmbqZTNz9', // Replace with your actual Razorpay key ID
          amount: orderData.data.amount.toString(),
          currency: 'INR',
          name: 'SignBridge',
          description: 'SignBridge Plan Purchase',
          order_id: orderData.data.id,
          handler: async (response) => {
            // Handle the payment success scenario
            console.log('Payment successful:', response);
            // You can send the payment details to your server for further processing
            try {
              await axios.post('http://localhost:5000/api/auth/verify-payment', {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              // Perform any additional actions after successful payment verification
            } catch (error) {
              console.error('Error verifying payment:', error);
            }
          },
          prefill: {
            name: 'John Doe', // Replace with the user's name
            email: 'johndoe@example.com', // Replace with the user's email
            contact: '1234567890' // Replace with the user's contact number
          },
          notes: {
            address: 'SignBridge Corporate Office'
          },
          theme: {
            color: '#3399cc'
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        alert('Invalid OTP');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className='w-full py-[10rem] px-4 bg-white'>
      <div className='max-w-[1240px] mx-auto grid md:grid-cols-2 gap-8'>
        {/* Basic Plan card */}
        <div className='w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300'>
          <img className='w-20 mx-auto mt-[-3rem] bg-white' src={BasicPlanIcon} alt="Basic Plan" />
          <h2 className='text-2xl font-bold text-center py-8'>Basic Plan</h2>
          <p className='text-center text-4xl font-bold'>Free</p>
          <div className='text-center font-medium'>
            <p className='py-2 border-b mx-8 mt-8'>Access to basic translations</p>
            <p className='py-2 border-b mx-8'>Support for 2 languages</p>
            <p className='py-2 mx-8'>Up to 50 sign translations per month</p>
          </div>
          <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3'>Explore</button>
        </div>
        {/* Pro Plan card */}
        <div className='w-full shadow-xl bg-gray-100 flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300'>
          <img className='w-20 mx-auto mt-[-3rem] bg-transparent' src={ProPlanIcon} alt="Pro Plan" />
          <h2 className='text-2xl font-bold text-center py-8'>Pro Plan</h2>
          <p className='text-center text-4xl font-bold'>₹299/month</p>
          <div className='text-center font-medium'>
            <p className='py-2 border-b mx-8 mt-8'>Advanced analytics dashboard</p>
            <p className='py-2 border-b mx-8'>Support for 5 languages</p>
            <p className='py-2 mx-8'>Unlimited translations and API access</p>
          </div>
          <button
            className="bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3"
            onClick={() => handleBuyNow({ price: 299 })}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Buy Now'}
          </button>
          {showOTPInput && (
            <div className="flex justify-center mt-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-64"
                placeholder="Enter OTP"
              />
              <button
                className="bg-green-500 text-white rounded-md px-4 py-2 ml-2"
                onClick={handleOTPSubmit}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Submit'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cards;