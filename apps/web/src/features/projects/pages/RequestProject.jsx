import React, { useState, useEffect } from 'react';
import RequestProjectForm from '../components/RequestProjectForm';
import useRequestProject from '../hooks/useRequestProject';
import { useProfileStatus } from '@/features/profile/hooks/useProfileStatus';
import ProfileIncompleteModal from '@/components/ProfileIncompleteModal';

const RequestProject = () => {
  const { 
    form, 
    fieldErrors, 
    isLoading,
    handleChange, 
    handleBannerSelection,
    handleRemoveAttachment,
    handleSubmit,
    deadlineConstraints,
  } = useRequestProject();

  const { isComplete, isLoading: profileLoading } = useProfileStatus();
  const [showHelp, setShowHelp] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Mostrar modal si el perfil está incompleto
  useEffect(() => {
    if (!profileLoading && !isComplete) {
      setShowModal(true);
    }
  }, [profileLoading, isComplete]);

  // Loading state mientras se verifica el perfil
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileIncompleteModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        showCloseButton={false}
      />
      
      <section className="flex flex-col items-center justify-start w-full min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold dark:text-gray-100">
            Solicitar un <span className="text-lime-600 dark:text-lime-500">proyecto</span>
          </h1>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="text-blue-600 hover:text-blue-800"
            title="¿Cómo llenar el formulario?"
          >
            <svg className='text-gray-800 dark:text-gray-300 w-6 sm:w-8 h-auto cursor-pointer mt-3' xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
              <g fill="none" stroke="#4E4E4E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4m0-4h.01"/>
              </g>
            </svg>
          </button>
        </div>

        {/* Panel de ayuda con recomendaciones */}
        {showHelp && (
          <div className="max-w-4xl w-full bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-700 text-sm text-lime-800 dark:text-lime-300 p-4 rounded mb-8">
            <p className="mb-2 font-semibold">Recomendaciones para llenar el formulario:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Título del proyecto:</strong> Sé claro y conciso. Usa un título que describa en pocas palabras el propósito del proyecto.</li>
              <li><strong>Descripción corta:</strong> Esta aparecerá en las tarjetas del sistema. Resume en 1 o 2 líneas de qué trata el proyecto.</li>
              <li><strong>Descripción detallada:</strong> Explica a fondo qué problema se busca resolver, qué se espera lograr y cualquier otro detalle relevante.</li>
              <li><strong>Tipo de proyecto (sugerido):</strong> Marca una o más opciones dependiendo del enfoque que consideres adecuado: Tesis, Servicio Social, Proyecto Integrador, etc.</li>
              <li><strong>Facultad sugerida (sugerido):</strong> Elige la(s) facultad(es) que crees que tienen el perfil ideal para desarrollar tu proyecto. Por ejemplo: FIE, FACIMAR, etc.</li>
              <li><strong>Tipo de problemática:</strong> Selecciona el tipo de reto que se busca resolver: tecnológico, ambiental, logístico, etc. Si no está en la lista, elige "Otro" y describe el problema.</li>
              <li><strong>Vigencia:</strong> Fecha límite estimada para que el proyecto esté resuelto o implementado. Esta puede cambiar más adelante, pero es útil para la planeación inicial.</li>
              <li><strong>Banner:</strong> Puedes subir una imagen representativa o seleccionar una predeterminada. Esta imagen se mostrará en el sistema como portada del proyecto.</li>
              <li><strong>Archivos adjuntos:</strong> Puedes agregar hasta 5 archivos relacionados con el proyecto (imágenes, PDFs, documentos, etc.).</li>
            </ul>
          </div>
        )}

        {/* Formulario de solicitud */}
        <RequestProjectForm
          form={form}
          fieldErrors={fieldErrors}
          isLoading={isLoading}
          handleChange={handleChange}
          handleBannerSelection={handleBannerSelection}
          handleRemoveAttachment={handleRemoveAttachment}
          handleSubmit={handleSubmit}
          deadlineConstraints={deadlineConstraints}
        />
      </section>
    </>
  );
};

export default RequestProject;
