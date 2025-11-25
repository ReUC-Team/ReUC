import React from 'react';
import whatIsllustration from '@/assets/what-is.png';

const WhatIs = () => {
  return (
    <section className="mx-auto px-4 sm:px-6 py-12 sm:py-16 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 mt-10">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 sm:gap-10 mx-4 sm:mx-8 md:mx-12 lg:mx-20">
        <div className="w-full md:w-11/12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6">
            ¿Qué es <span className="text-lime-700">ReUC</span>?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed mb-4">
            El Repositorio de la Universidad de Colima (<span className="text-lime-700">ReUC</span>) es una plataforma creada por la Universidad de Colima que permite a organizaciones, empresas y personas externas proponer proyectos reales que puedan ser desarrollados por estudiantes universitarios como parte de su formación profesional.
          </p>
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed">
            <span className="text-lime-700">ReUC</span> funciona como un puente entre la comunidad y la universidad, promoviendo la colaboración para resolver problemáticas sociales, tecnológicas, ambientales, educativas, entre muchas otras.
          </p>
        </div>

        {/* Imagen */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={whatIsllustration}
            alt="Ilustración de colaboración"
            className="max-w-full h-auto rounded-lg"
          />
        </div>

      </div>
    </section>
  );
};

export default WhatIs;
