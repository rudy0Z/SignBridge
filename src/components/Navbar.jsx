import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import axios from 'axios';

const Navbar = ({ isPremiumMember }) => {
  const [nav, setNav] = useState(false);
  const [username, setUsername] = useState('');

  const handleNav = () => {
    setNav(!nav);
  };

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        // Check if the token is retrieved correctly
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response data:', response.data);
        // Check the response data
        setUsername(response.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isLoggedIn) {
      console.log('User is logged in');
      // Check if the user is logged in
      fetchUserData();
    } else {
      console.log('User is not logged in');
    }
  }, [isLoggedIn]);

  return (
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      <h1 className="w-full text-3xl font-bold text-[#00df9a]">SignBridge</h1>
      <ul className="hidden md:flex">
        <li className="p-4">Home</li>
        <li className="p-4">Features</li>
        <li className="p-4">Support</li>
        <li className="p-4">About</li>
        <li className="p-4">Contact</li>
        {isLoggedIn ? (
          <li className="p-4 flex items-center">
            Hi, {username}
            {isPremiumMember && <span className="ml-2">👑</span>}
          </li>
        ) : (
          <>
            <li className="p-4">
              <Link to="/login" className="bg-[#00df9a] text-black px-4 py-2 rounded-lg">
                Login
              </Link>
            </li>
            <li className="p-4">
              <Link to="/signup" className="bg-[#00df9a] text-black px-4 py-2 rounded-lg">
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
        className={
          nav
            ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
            : 'ease-in-out duration-500 fixed left-[-100%]'
        }
      >
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">SignBridge</h1>
        <li className="p-4 border-b border-gray-600">Home</li>
        <li className="p-4 border-b border-gray-600">Features</li>
        <li className="p-4 border-b border-gray-600">Support</li>
        <li className="p-4 border-b border-gray-600">About Us</li>
        <li className="p-4 border-b border-gray-600">Contact</li>
        <li className="p-4 border-b border-gray-600">
          <Link to="/login" className="bg-[#00df9a] text-black w-full py-2 rounded-lg">
            Login
          </Link>
        </li>
        <li className="p-4">
          <Link to="/signup" className="bg-[#00df9a] text-black w-full py-2 rounded-lg">
            Signup
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;