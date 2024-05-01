import React from 'react';
import {
  FaFacebookSquare,
  FaInstagram,
  FaTwitterSquare,
  FaGithubSquare,
  FaLinkedin,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='max-w-[1240px] mx-auto py-16 px-4 grid lg:grid-cols-3 gap-8 text-gray-300'>
      <div>
        <h1 className='w-full text-3xl font-bold text-[#00df9a]'>SignBridge</h1>
        <p className='py-4'>Enabling seamless communication for the deaf and hard of hearing community through innovative sign language translation technology.</p>
        <div className='flex justify-between md:w-[75%] my-6'>
            <FaFacebookSquare size={30} />
            <FaInstagram size={30} />
            <FaTwitterSquare size={30} />
            <FaGithubSquare size={30} />
            <FaLinkedin size={30} />
        </div>
      </div>
      <div className='lg:col-span-2 flex justify-between mt-6'>
        <div>
            <h6 className='font-medium text-gray-400'>Technology</h6>
            <ul>
                <li className='py-2 text-sm'>Machine Learning</li>
                <li className='py-2 text-sm'>Computer Vision</li>
                <li className='py-2 text-sm'>Natural Language Processing</li>
                <li className='py-2 text-sm'>APIs</li>
            </ul>
        </div>
        <div>
            <h6 className='font-medium text-gray-400'>Support</h6>
            <ul>
                <li className='py-2 text-sm'>Help Center</li>
                <li className='py-2 text-sm'>Documentation</li>
                <li className='py-2 text-sm'>Community Forums</li>
                <li className='py-2 text-sm'>Contact Us</li>
            </ul>
        </div>
        <div>
            <h6 className='font-medium text-gray-400'>Company</h6>
            <ul>
                <li className='py-2 text-sm'>About Us</li>
                <li className='py-2 text-sm'>Blog</li>
                <li className='py-2 text-sm'>Careers</li>
                <li className='py-2 text-sm'>Press</li>
            </ul>
        </div>
        <div>
            <h6 className='font-medium text-gray-400'>Legal</h6>
            <ul>
                <li className='py-2 text-sm'>Privacy Policy</li>
                <li className='py-2 text-sm'>Terms of Service</li>
                <li className='py-2 text-sm'>Accessibility</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
