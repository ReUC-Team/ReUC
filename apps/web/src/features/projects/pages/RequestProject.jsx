import React, { useState } from 'react';
import RequestProjectForm from '../components/RequestProjectForm';
import useRequestProject from '../hooks/useRequestProject';

const RequestProject = () => {
  const { form, error, handleChange, handleSubmit } = useRequestProject();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <section className="flex flex-col items-center justify-start w-full min-h-screen p-10">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-5xl font-bold">
          Solicitar un <span className="text-lime-600">proyecto</span>
        </h1>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="text-blue-600 hover:text-blue-800"
          title="¿Cómo llenar el formulario?"
        >
<svg className='text-black w-8 h-auto cursor-pointer mt-3' xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><g fill="none" stroke="#4E4E4E" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></g></svg>
        </button>
      </div>

      {showHelp && (
        <div className="max-w-4xl w-full bg-green-100 border border-green-300 text-sm text-green-800 p-4 rounded mb-8">
          <p className="mb-2 font-semibold">Recomendaciones para llenar el formulario:</p>
          <ul className="list-disc pl-5 space-y-1">
  <li><strong>Nombre del solicitante:</strong> Ingresa el nombre completo de la persona que representa la empresa o institución.</li>
  <li><strong>Teléfono y correo de contacto:</strong> Debes proporcionar al menos uno de los dos medios de contacto. Preferiblemente ambos para facilitar la comunicación.</li>
  <li><strong>Empresa:</strong> Indica el nombre completo de la organización que solicita el proyecto. Si es un proyecto personal, puedes escribir "Independiente".</li>
  <li><strong>Título del proyecto:</strong> Sé claro y conciso. Usa un título que describa en pocas palabras el propósito del proyecto.</li>
  <li><strong>Descripción corta:</strong> Esta aparecerá en las tarjetas del sistema. Resume en 1 o 2 líneas de qué trata el proyecto.</li>
  <li><strong>Descripción detallada:</strong> Explica a fondo qué problema se busca resolver, qué se espera lograr y cualquier otro detalle relevante.</li>
  <li><strong>Tipo de proyecto (sugerido):</strong> Marca una o más opciones dependiendo del enfoque que consideras adecuado: Tesis, Servicio Social, Proyecto Integrador, etc.</li>
  <li><strong>Facultad sugerida (sugerido):</strong> Elige la(s) facultad(es) que crees que tienen el perfil ideal para desarrollar tu proyecto. Por ejemplo: FIE, FACIMAR, etc.</li>
  <li><strong>Tipo de problemática:</strong> Selecciona el tipo de reto que se busca resolver: tecnológico, ambiental, logístico, etc. Si no está en la lista, elige "Otro" y describe el problema.</li>
  <li><strong>Vigencia:</strong> Fecha límite estimada para que el proyecto esté resuelto o implementado. Esta puede cambiar más adelante, pero es útil para la planeación inicial.</li>
  <li><strong>Miniatura o banner:</strong> Puedes subir una imagen representativa o seleccionar una predeterminada. Esta imagen se mostrará en el sistema como portada del proyecto.</li>
</ul>

        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <RequestProjectForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </section>
  );
};

export default RequestProject;