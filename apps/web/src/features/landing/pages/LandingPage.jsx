// LandingPage.jsx
import React, { useEffect } from 'react';
import landingImage from '@/assets/landing-image.jpg';
import Hero from '../components/Hero';
import GoogleBtn from '../components/GoogleBtn';
import RegisterBtn from '../components/RegisterBtn';
import LoginPrompt from '../components/LoginPrompt';
import useLogout from '../../auth/hooks/useLogout';
import { Alerts } from '@/shared/alerts';
import BenefitsSection from '../components/BenefitsSection';
import FAQSection from '../components/FAQSection';
import WhatIs from '../components/WhatIs';
import WhyReUC from '../components/WhyReUC';
import HelpSection from '../components/HelpSection';
import ContactSection from '../components/ContactSection';

const LandingPage = () => {
  const { error } = useLogout();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');

    if (isLoggedIn) {
      localStorage.removeItem('token');
      sessionStorage.setItem('showLogoutAlert', 'true');
    }

    if (sessionStorage.getItem('showLogoutAlert')) {
      Alerts.info('Sesión cerrada');
      sessionStorage.removeItem('showLogoutAlert');
    }
  }, []);

  return (
    <main className="w-full">
      <section className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 min-h-screen py-8 lg:py-0">
        <div className='flex flex-col justify-center space-y-6 p-4 sm:p-6 w-full lg:w-6/12 h-full'>
          <Hero />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          <div className='flex flex-col items-start w-full gap-5'>
            <RegisterBtn />
            <p className='w-full sm:w-8/12 md:w-6/12 text-xs sm:text-sm ml-3'>
              Al registrarte, aceptas los Términos de Servicio y Política de Privacidad,
              Incluida la política de Uso de Cookies.
            </p>
            <div className="flex items-center gap-4 w-full sm:w-8/12 md:w-6/12">
              <hr className="flex-grow border-t border-gray-300 border-1" />
              <span className="text-sm text-gray-500">O</span>
              <hr className="flex-grow border-t border-gray-300 border-1" />
            </div>
            <LoginPrompt />
          </div>
        </div>

        {/* <div className='flex items-center justify-center w-6/12'>
          <img className='rounded-3xl' src={landingImage} alt="Landing visual" />
        </div> */}
         {/* Columna derecha: Imagen */}
          <div className='flex items-center justify-center w-full lg:w-6/12 mt-8 lg:mt-0'>
            <div className="relative">
              <div className="absolute inset-0 bg-lime-600 rounded-3xl transform rotate-3 opacity-10"></div>
              <img 
                className='relative rounded-3xl shadow-2xl w-full h-auto object-cover max-w-2xl hover:scale-105 transition-all duration-300' 
                src={landingImage} 
                alt="Plataforma REUC - Gestión de proyectos" 
              />
            </div>
          </div>
      </section>

      <section id="que-es">
        <WhatIs />
      </section>

      <section id="porque">
        <WhyReUC />
      </section>
      
      <section id="beneficios">
        <BenefitsSection />
      </section>

      <section id="faq">
        <FAQSection />
      </section>

      <section id="ayuda">
        <HelpSection />
      </section>

      <section id="contacto">
        <ContactSection />
      </section>
    </main>
  );
};

export default LandingPage;
