import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProjectImage from '../components/ProjectImage';
import ProjectSummary from '../components/ProjectSummary';
import ProjectInfoCard from '../components/ProjectInfoCard';
import AttachmentCard from '../components/AttachmentCard';
import useProjectDetails from '../hooks/useProjectDetails';
import { downloadAllAttachments } from '../projectsService';

export default function ProjectDetails() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { project, isLoading, error } = useProjectDetails(uuid);
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
    if (!project?.attachments || project.attachments.length === 0) {
      alert('No hay archivos para descargar');
      return;
    }

    setIsDownloadingAll(true);
    setDownloadError(null);
    
    try {
      const result = await downloadAllAttachments(project.attachments);
      
      if (result.failed > 0) {
        const errorMessage = `Se descargaron ${result.successful} de ${project.attachments.length} archivos.\n\nErrores:\n${result.errors.join('\n')}`;
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
  if (error || !project) {
    return (
      <section className="w-full px-10 py-12">
        <button
          onClick={() => navigate('/my-projects')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a mis proyectos
        </button>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Proyecto no encontrado</h2>
          <p className="text-red-600 mb-6">{error || 'No se pudo cargar la información del proyecto'}</p>
          <button
            onClick={() => navigate('/my-projects')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Volver a mis proyectos
          </button>
        </div>
      </section>
    );
  }

  // Extraer datos del proyecto
  const {
    title,
    description,
    shortDescription,
    bannerUrl,
    faculties = [],
    author,
    projectTypes = [],
    problemTypes = [],
    status,
    createdAt,
    estimatedDate,
    attachments = [],
  } = project;

  // Obtener datos del autor
  const authorFirstName = author?.firstName || 'No especificado';
  const authorLastName = author?.lastName || '';
  const authorFullName = `${authorFirstName} ${authorLastName}`.trim();
  const authorEmail = author?.email || null;

  // Datos específicos de outsider (pueden ser null)
  const outsiderData = author?.outsider || null;
  const organizationName = outsiderData?.organizationName || 'N/A';
  const phoneNumber = outsiderData?.phoneNumber || 'N/A';
  const location = outsiderData?.location || 'N/A';

  // Determinar si el autor es outsider o profesor
  const isOutsider = !!outsiderData;
  const authorRole = isOutsider ? 'Outsider' : 'Profesor';

  // Información del autor
  const authorInfo = [
    { 
      label: 'Nombre', 
      value: authorFullName
    },
    { 
      label: 'Tipo de usuario', 
      value: authorRole
    },
    ...(isOutsider ? [
      { 
        label: 'Organización', 
        value: organizationName
      },
      { 
        label: 'Teléfono de contacto', 
        value: phoneNumber
      },
      { 
        label: 'Ubicación', 
        value: location
      },
    ] : [
      {
        label: 'Información',
        value: 'Proyecto creado por un profesor'
      }
    ]),
  ];

  // Información del proyecto
  const projectInfo = [
    { 
      label: 'Tipo de proyecto', 
      value: projectTypes.length > 0 
        ? projectTypes
            .map(pt => typeof pt === 'object' ? pt.name : pt)  // Soporte para ambos
            .join(', ')
        : 'No especificado' 
    },
    { 
      label: 'Facultades', 
      value: faculties.length > 0 
        ? faculties
            .map(f => typeof f === 'object' ? f.name : f)
            .join(', ')
        : 'No especificada' 
    },
    { 
      label: 'Tipo de problemática', 
      value: problemTypes.length > 0 
        ? problemTypes
            .map(pt => typeof pt === 'object' ? pt.name : pt)
            .join(', ')
        : 'No especificado' 
    },
    { 
      label: 'Fecha estimada', 
      value: formatDate(estimatedDate) 
    },
    { 
      label: 'Fecha de creación', 
      value: formatDate(createdAt) 
    },
    { 
      label: 'Estado', 
      value: status === 'in_progress' ? 'En Progreso' : 
             status === 'completed' ? 'Completado' : 
             status === 'approved' ? 'Aprobado' : 
             status === 'pending' ? 'Pendiente' : status
    },
  ];

  // Función para contactar
  const handleContact = () => {
    if (authorEmail) {
      window.location.href = `mailto:${authorEmail}?subject=Consulta sobre proyecto: ${title}`;
    } else {
      alert('No hay correo de contacto disponible para este proyecto');
    }
  };

  return (
    <section className="w-full px-10 py-12">
      {/* Botón de regreso */}
      <button
        onClick={() => navigate('/my-projects')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a mis proyectos
      </button>

      <h1 className="text-4xl font-bold mb-6">
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
            description={description || shortDescription}
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
          {/* Información del autor */}
          <h2 className="text-3xl font-bold mb-3">
            Información del <span className="text-lime-700">autor</span>
          </h2>
          <ProjectInfoCard items={authorInfo} />

          {/* Información del proyecto */}
          <h2 className="text-3xl font-bold mb-3 mt-8">
            Información del <span className="text-lime-700">proyecto</span>
          </h2>
          <ProjectInfoCard items={projectInfo} />

          {/* Botones de acción */}
          <div className="flex flex-col gap-3 pt-6 w-11/12">
            {/* Botón Descargar Todos los Archivos */}
            <button 
              onClick={handleDownloadAll}
              disabled={isDownloadingAll || attachments.length === 0}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            {/* Mensaje de error si ocurrió */}
            {downloadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {downloadError}
              </div>
            )}
            
            {/* Botón Ponerse en Contacto */}
            <button 
              onClick={handleContact}
              disabled={!authorEmail}
              className="px-4 py-2 border-2 border-lime-600 text-lime-700 font-semibold rounded-lg hover:bg-lime-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title={!authorEmail ? 'No hay correo de contacto disponible' : `Contactar a ${authorFullName}`}
            >
              Ponerse en contacto
            </button>

            {/* Información adicional sobre el proyecto */}
            <div className="p-3 bg-lime-50 border border-lime-200 rounded-lg text-sm text-lime-700 flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold mb-1">Proyecto aprobado</p>
                <p className="text-xs">
                  Este proyecto fue aprobado el {formatDate(createdAt)}. Puedes gestionar su progreso desde esta página.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}