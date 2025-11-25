// src/components/WhyReUC.jsx
import React from 'react';
import whyReUCllustration from '@/assets/why-reuc.png';

const WhyReUC = () => {
  return (
    <section className="mx-auto px-4 sm:px-6 py-12 sm:py-16 dark:bg-slate-800 text-gray-800 dark:text-gray-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 mx-4 sm:mx-8 md:mx-12 lg:mx-20">
        <div className="md:w-1/2 flex justify-center">
          <img
            src={whyReUCllustration}
            alt="Ilustración de colaboración con la comunidad"
            className="max-w-full h-auto rounded-lg"
          />
        </div>

        <div className="w-full md:w-11/12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6">
            ¿Por qué <span className="text-lime-700">ReUC</span>?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed mb-4">
            Porque creemos que los conocimientos deben ponerse al servicio de la sociedad. <br />
            <span className="text-lime-700 font-semibold">ReUC</span> no solo impulsa el aprendizaje práctico de los estudiantes, sino que también genera soluciones innovadoras, sustentables y accesibles para quienes enfrentan desafíos reales. Con esta plataforma:
          </p>
          <ul className="list-disc list-outside ml-6 space-y-2 sm:space-y-3 text-lg sm:text-xl md:text-2xl text-lime-700 font-bold">
            <li>La comunidad obtiene ayuda profesional sin costo.</li>
            <li>Los estudiantes adquieren experiencia aplicando lo que aprenden en las aulas.</li>
            <li>La universidad refuerza su compromiso social.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyReUC;
