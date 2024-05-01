import React from 'react';
import SignLanguageExample from '../assets/laptop.jpg';  // Use an appropriate image

const SignLanguageAnalytics = () => {
  return (
    <div className='w-full bg-white py-16 px-4'>
      <div className='max-w-[1240px] mx-auto grid md:grid-cols-2'>
        <img className='w-[500px] mx-auto my-4' src={SignLanguageExample} alt='Sign Language Translation' />
        <div className='flex flex-col justify-center'>
          <p className='text-[#00df9a] font-bold '>SIGN LANGUAGE TRANSLATION</p>
          <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold py-2'>Real-time Communication Enabled</h1>
          <p>
            Experience seamless communication with our cutting-edge sign language translation technology. Our platform utilizes advanced machine learning algorithms to provide accurate, real-time translations, enhancing accessibility for the deaf and hard of hearing community. Explore how we bridge communication gaps and foster inclusivity across various settings.
          </p>
          <button className='bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3'>Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default SignLanguageAnalytics;
