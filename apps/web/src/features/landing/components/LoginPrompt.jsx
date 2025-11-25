import React from 'react';

const LoginPrompt = () => (
  <div className='flex flex-col gap-4 w-full'>
    <p className="text-sm sm:text-base font-semibold ml-5">
      ¿Ya tienes una cuenta?{' '}
    </p>
    <div className='flex max-w-sm py-3 px-4 rounded-2xl shadow-md border-2 border-gray-200 w-full font-semibold text-center items-center justify-center'>
      <a href='/login' className="font-semibold text-lime-800 w-full text-sm sm:text-base">Inicia Sesion</a>
    </div>
  </div>
);

export default LoginPrompt;