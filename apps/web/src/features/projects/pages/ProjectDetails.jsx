import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProjectImage from '../components/ProjectImage';
import ProjectSummary from '../components/ProjectSummary';
import ProjectInfoCard from '../components/ProjectInfoCard';
import AttachmentCard from '../components/AttachmentCard';
import useApplicationDetails from '../hooks/useApplicationDetails';
import { downloadAllAttachments } from '../projectsService';

export default function ProjectDetails() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { application, isLoading, error } = useApplicationDetails(uuid);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadError, setDownloadError] = useState(null);


  // Formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para descargar todos los archivos
  const handleDownloadAll = async () => {
    if (!application?.attachments || application.attachments.length === 0) {
      alert('No hay archivos para descargar');
      return;
    }

    setIsDownloadingAll(true);
    setDownloadError(null);
    
    try {
      const result = await downloadAllAttachments(application.attachments);
      
      if (result.failed > 0) {
        // Algunos archivos fallaron
        const errorMessage = `Se descargaron ${result.successful} de ${application.attachments.length} archivos.\n\nErrores:\n${result.errors.join('\n')}`;
        setDownloadError(errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || 'Error desconocido al descargar archivos';
      setDownloadError(errorMessage);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full px-10 py-12">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-10"></div>
        
        <div className='flex h-screen mt-10'>
          <div className="w-6/12">
            <div className="w-full h-96 bg-gray-200 rounded-xl animate-pulse mb-6"></div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="w-7/12 ml-6">
            <div className="h-8 w-80 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !application) {
    return (
      <section className="w-full px-10 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Proyecto no encontrado</h2>
          <p className="text-red-600 mb-6">{error || 'No se pudo cargar la información del proyecto'}</p>
          <button
            onClick={() => navigate('/explore-projects')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Volver a explorar proyectos
          </button>
        </div>
      </section>
    );
  }

  // Extraer datos de la aplicación
  const {
    title,
    shortDescription,
    detailedDescription,
    bannerUrl,
    faculty,
    faculties = [],
    outsider,
    projectTypes = [],
    problemTypes = [],
    status,
    createdAt,
    dueDate,
    attachments = [],
  } = application;

  // Preparar información del solicitante
  const applicantInfo = [
    { 
      label: 'Nombre del solicitante', 
      value: `${outsider.firstName} ${outsider.lastName}`.trim() || 'No especificado'
    },
    { 
      label: 'Empresa', 
      value: outsider.company || 'No especificado' 
    },
    { 
      label: 'Teléfono de contacto', 
      value: outsider.phone || 'No especificado' 
    },
    { 
      label: 'Ubicación', 
      value: outsider.location || 'No especificado' 
    },
  ];

  // Preparar información del proyecto
  const projectInfo = [
    { 
      label: 'Tipo de proyecto', 
      value: projectTypes.length > 0 ? projectTypes.join(', ') : 'No especificado' 
    },
    { 
      label: 'Facultades', 
      value: faculties.length > 0 ? faculties.join(', ') : 'No especificada' 
    },
    { 
      label: 'Tipo de problemática', 
      value: problemTypes.length > 0 ? problemTypes.join(', ') : 'No especificado' 
    },
    { 
      label: 'Fecha límite', 
      value: formatDate(dueDate) 
    },
    { 
      label: 'Fecha de creación', 
      value: formatDate(createdAt) 
    },
    { 
      label: 'Estado', 
      value: status === 'pending' ? 'Pendiente' : 
             status === 'approved' ? 'Aprobado' : 
             status === 'rejected' ? 'Rechazado' : 
             status === 'in_progress' ? 'En Progreso' : 
             status === 'completed' ? 'Completado' : status
    },
  ];

  // Función para manejar contacto
  const handleContact = () => {
    if (outsider?.email) {
      window.location.href = `mailto:${outsider.email}?subject=Interés en el proyecto: ${title}`;
    } else {
      alert('No hay correo de contacto disponible');
    }
  };

  // Función para aceptar proyecto
  const handleAccept = () => {
    console.log('Aceptar proyecto:', uuid);
    alert('Funcionalidad de aceptar proyecto en desarrollo');
  };

  return (
    <section className="w-full px-10 py-12">
      {/* Botón de regreso */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      <h1 className="text-4xl font-bold">
        Detalles del <span className="text-lime-700">proyecto</span>
      </h1>

      <div className='flex mt-10 gap-6'>
        {/* Columna izquierda: Imagen, descripción y archivos adjuntos */}
        <div className="w-5/12">
          {/* Banner */}
          <ProjectImage 
            src={bannerUrl} 
            alt={title} 
          />
          
          {/* Resumen del proyecto */}
          <ProjectSummary
            title={title}
            description={detailedDescription}
          />

          {/* Archivos adjuntos */}
          {attachments.length > 0 && (
            <div className="mt-6">
              <h2 className="text-3xl font-bold mb-3">
                Documentos <span className="text-lime-700">adjuntos</span>
              </h2>
              
              <div className="space-y-3 mr-10">
                {attachments.map((file, index) => (
                  <AttachmentCard key={index} file={file} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha: Información */}
        <div className="w-7/12">
          {/* Información del solicitante */}
          <h2 className="text-3xl font-bold mb-3">
            Información del <span className="text-lime-700">solicitante</span>
          </h2>
          <ProjectInfoCard items={applicantInfo} />

          {/* Información del proyecto */}
          <h2 className="text-3xl font-bold mb-3 mt-8">
            Información del <span className="text-lime-700">proyecto</span>
          </h2>
          <ProjectInfoCard items={projectInfo} />

          {/* Botones de acción */}
          <div className="flex flex-col gap-3 pt-4 w-11/12">
            <div className='flex gap-5'>
              {/* Botón Aceptar Proyecto */}
              <button 
                onClick={handleAccept}
                className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 font-semibold w-6/12 transition"
              >
                Aceptar proyecto
              </button>
              
              {/* Botón Descargar Todos los Archivos */}
              <button 
                onClick={handleDownloadAll}
                disabled={isDownloadingAll || attachments.length === 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold w-6/12 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                title={attachments.length === 0 ? 'No hay archivos para descargar' : 'Descargar todos los documentos'}
              >
                {isDownloadingAll ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Descargando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar todos ({attachments.length})
                  </>
                )}
              </button>
            </div>

            {/* Mensaje de error si ocurrió */}
            {downloadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {downloadError}
              </div>
            )}
            
            {/* Botón Ponerse en Contacto */}
            <button 
              onClick={handleContact}
              disabled={!outsider?.email}
              className="px-4 py-2 border-2 border-lime-600 text-lime-700 font-semibold rounded-lg hover:bg-lime-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ponerse en contacto
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}