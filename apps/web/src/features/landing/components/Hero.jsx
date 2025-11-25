import React from 'react';

const Hero = () => (
  <div className="flex flex-col gap-6 sm:gap-8">
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
      Repositorio para el registro, gestión y seguimiento de{' '}
      <span className="text-lime-700">problemáticas del sector productivo</span>
    </h1>
    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-lime-700">
      ¡Comienza ahora!
    </p>
  </div>
);

export default Hero;
