import React from 'react';

const ContactSection = () => {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-16 bg-white dark:bg-gray-900" id="contacto">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Contáctanos
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Encuentra toda nuestra información de contacto 
            y conéctate con nosotros a través de tus canales preferidos.
          </p>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Tarjeta: Correo electrónico */}
          <div className="bg-gray-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-center w-16 h-16 bg-lime-600 rounded-full mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
              Correo Electrónico
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Envíanos un correo y te responderemos lo antes posible.
            </p>
            <div className="text-center">
              <a 
                href="mailto:reuc@ucol.mx" 
                className="text-lime-700 dark:text-lime-400 hover:text-lime-800 dark:hover:text-lime-300 font-semibold text-lg hover:underline transition-colors"
              >
                reuc@ucol.mx
              </a>
            </div>
          </div>

          {/* Tarjeta: Teléfono */}
          <div className="bg-gray-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-center w-16 h-16 bg-lime-600 rounded-full mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
              Teléfono
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Llámanos de lunes a viernes de 9:00 AM a 6:00 PM.
            </p>
            <div className="text-center">
              <a 
                href="tel:+523121234567" 
                className="text-lime-800 dark:text-lime-400 hover:text-lime-900 dark:hover:text-lime-300 font-semibold text-lg hover:underline transition-colors"
              >
                +52 312 123 4567
              </a>
            </div>
          </div>

          {/* Tarjeta: Ubicación */}
          <div className="bg-gray-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-center w-16 h-16 bg-lime-600 rounded-full mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
              Ubicación
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Visítanos en nuestras oficinas.
            </p>
            <div className="text-center">
              <p className="text-lime-900 dark:text-lime-400 font-semibold text-lg">
                Universidad de Colima
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Av. Universidad No. 333, Colima, Col.
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Redes Sociales */}
        <div className="bg-gray-100 dark:bg-gray-800 p-10 rounded-2xl shadow-lg">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Síguenos en <span className="text-lime-700">Redes Sociales</span>
          </h3>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-10 text-lg">
            Mantente al día con nuestras últimas noticias, eventos y actualizaciones.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Facebook */}
            <a 
              href="https://facebook.com/REUCOficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-lime-500"
            >
              <div className="flex items-center">
                <div className="bg-lime-600 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Facebook</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">REUC Oficial</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/reuc__ucol" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-lime-500"
            >
              <div className="flex items-center">
                <div className="bg-lime-600 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Instagram</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">@reuc__ucol</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://linkedin.com/company/REUCUCOL" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-lime-500"
            >
              <div className="flex items-center">
                <div className="bg-lime-600 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">LinkedIn</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">REUC UCOL</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Llamado a la acción adicional */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            ¿Prefieres visitarnos en persona? Estamos abiertos de lunes a viernes de 9:00 AM a 6:00 PM.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:reuc@ucol.mx"
              className="px-8 py-3 bg-lime-600 text-white font-semibold rounded-lg hover:bg-lime-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Enviar correo
            </a>
            <a 
              href="tel:+523121234567"
              className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-lime-800 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Llamar ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
