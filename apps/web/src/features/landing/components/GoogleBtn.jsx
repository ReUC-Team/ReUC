import React from 'react';
import googleIcon from '@/assets/google-icon.webp';

const GoogleBtn = () => (
  <div className='flex py-3 px-4 rounded-3xl shadow-md border-1 border-gray-200 w-full font-semibold text-center items-center justify-center'>
    <img className='w-6 h-6 sm:w-8 sm:h-8 mr-2' src={googleIcon} alt="" />
    <a className="font-semibold text-sm sm:text-base">Registrarse con Google</a>
  </div>
);

export default GoogleBtn;