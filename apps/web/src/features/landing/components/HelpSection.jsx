import React, { useState } from 'react';
import helpIllustration from '@/assets/help.png';
import Modal from './Modal';

const HelpSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="bg-lime-600 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto flex flex-col-reverse md:flex-row items-center gap-12 sm:gap-16">
          {/* Contenido */}
          <div className="w-full lg:w-7/12">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6">¿Necesitas ayuda?</h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-semibold">
              Estamos aquí para apoyarte durante todo el proceso.
            </p>

            <ul className="space-y-6">
              <li>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                  ¿Tienes dudas al llenar el formulario?
                </h3>
                <p className="text-lg sm:text-xl text-lime-900 font-semibold">
                  Consulta nuestra guía paso a paso con ejemplos claros y recomendaciones útiles.
                </p>
              </li>
              <li>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                  ¿No sabes qué tipo de proyecto elegir?
                </h3>
                <p className="text-lg sm:text-xl text-lime-900 font-semibold">
                  Lee nuestra descripción de modalidades académicas y elige la que más se ajuste a tu caso.
                </p>
              </li>
              <li>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                  ¿Tienes problemas técnicos?
                </h3>
                <p className="text-lg sm:text-xl text-lime-900 font-semibold">
                  Escríbenos directamente y con gusto te ayudamos.
                </p>
              </li>
            </ul>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 sm:mt-10 px-6 sm:px-8 py-3 sm:py-4 bg-lime-700 text-white hover:bg-lime-800 font-semibold rounded-xl shadow-lg transition-colors duration-300 text-sm sm:text-base"
            >
              Ver guía de ayuda
            </button>
          </div>

          {/* Imagen */}
          <div className="flex-1 flex justify-center">
            <img
              src={helpIllustration}
              alt="Ilustración de ayuda o soporte"
              className="w-auto h-auto object-contain rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Guía de Ayuda Completa"
      >
        <div className="space-y-8">
          {/* Sección 1 */}
          <div>
            <h3 className="text-2xl font-bold text-lime-600 mb-4">
              Cómo llenar el formulario
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">Paso 1: Información Personal</h4>
                <p className="text-gray-700">
                  Completa tus datos básicos: nombre completo, correo electrónico institucional 
                  y número de matrícula. Asegúrate de que tu correo sea válido para recibir 
                  confirmaciones.
                </p>
                <div className="mt-2 p-3 bg-lime-50 border-l-4 border-lime-500 text-sm">
                  <strong>Ejemplo:</strong> juan.perez@universidad.edu.mx
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Paso 2: Detalles del Proyecto</h4>
                <p className="text-gray-700">
                  Proporciona un título descriptivo (máximo 100 caracteres) y un resumen claro 
                  de tu proyecto (200-500 palabras). Incluye objetivos, metodología y resultados 
                  esperados.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Paso 3: Documentos Requeridos</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Propuesta de proyecto (PDF, máx. 5MB)</li>
                  <li>Carta de aceptación del asesor</li>
                  <li>Cronograma de actividades</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sección 2 */}
          <div>
            <h3 className="text-2xl font-bold text-lime-600 mb-4">
              Tipos de Proyecto
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-lime-200 p-5 rounded-lg hover:border-lime-500 transition-colors">
                <h4 className="font-bold text-lg mb-2">Tesis de Investigación</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Proyecto de investigación original que contribuye al conocimiento en tu área de estudio.
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Duración:</strong> 12-18 meses<br/>
                  <strong>Ideal para:</strong> Estudiantes interesados en posgrado
                </p>
              </div>

              <div className="border-2 border-lime-200 p-5 rounded-lg hover:border-lime-500 transition-colors">
                <h4 className="font-bold text-lg mb-2">Proyecto Aplicado</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Desarrollo de una solución práctica a un problema real de una organización.
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Duración:</strong> 6-12 meses<br/>
                  <strong>Ideal para:</strong> Experiencia profesional directa
                </p>
              </div>

              <div className="border-2 border-lime-200 p-5 rounded-lg hover:border-lime-500 transition-colors">
                <h4 className="font-bold text-lg mb-2">Desarrollo Tecnológico</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Creación de software, aplicaciones o sistemas innovadores con impacto social.
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Duración:</strong> 8-14 meses<br/>
                  <strong>Ideal para:</strong> Desarrolladores y tecnólogos
                </p>
              </div>

              <div className="border-2 border-lime-200 p-5 rounded-lg hover:border-lime-500 transition-colors">
                <h4 className="font-bold text-lg mb-2">Emprendimiento</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Plan de negocio completo con validación de mercado y modelo financiero.
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Duración:</strong> 10-15 meses<br/>
                  <strong>Ideal para:</strong> Futuros emprendedores
                </p>
              </div>
            </div>
          </div>

          {/* Sección 3 */}
          <div>
            <h3 className="text-2xl font-bold text-lime-600 mb-4">
              Solución de Problemas Técnicos
            </h3>
            <div className="space-y-3">
              <details className="bg-gray-50 p-4 rounded-lg cursor-pointer">
                <summary className="font-semibold text-lg">
                  El formulario no se envía correctamente
                </summary>
                <p className="mt-3 text-gray-700 text-sm">
                  Verifica que todos los campos obligatorios estén completos (marcados con *). 
                  Si el problema persiste, intenta limpiar el caché del navegador o usa un 
                  navegador diferente (recomendamos Chrome o Firefox).
                </p>
              </details>

              <details className="bg-gray-50 p-4 rounded-lg cursor-pointer">
                <summary className="font-semibold text-lg">
                  No puedo subir mis archivos
                </summary>
                <p className="mt-3 text-gray-700 text-sm">
                  Asegúrate de que tus archivos cumplan los requisitos: formato PDF, tamaño 
                  máximo 5MB por archivo. Si son imágenes, usa JPG o PNG con máximo 2MB.
                </p>
              </details>

              <details className="bg-gray-50 p-4 rounded-lg cursor-pointer">
                <summary className="font-semibold text-lg">
                  No recibí el correo de confirmación
                </summary>
                <p className="mt-3 text-gray-700 text-sm">
                  Revisa tu carpeta de spam o correos no deseados. Si no aparece después de 
                  10 minutos, contacta a soporte técnico con tu número de matrícula.
                </p>
              </details>
            </div>
          </div>

          {/* Sección 4 */}
          <div className="bg-lime-50 p-6 rounded-lg border-2 border-lime-300">
            <h3 className="text-xl font-bold text-lime-700 mb-3">
              ¿Necesitas más ayuda?
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> soporte.proyectos@universidad.edu.mx
              </p>
              <p>
                <strong>WhatsApp:</strong> +52 123 456 7890
              </p>
              <p>
                <strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM
              </p>
              <p className="mt-4 text-sm">
                También puedes agendar una cita personalizada con nuestro equipo de asesores 
                haciendo clic en el botón "Agendar Cita" en tu panel de usuario.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HelpSection;
