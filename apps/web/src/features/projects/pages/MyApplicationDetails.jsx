import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProjectImage from '../components/ProjectImage';
import ProjectSummary from '../components/ProjectSummary';
import ProjectInfoCard from '../components/ProjectInfoCard';
import AttachmentCard from '../components/AttachmentCard';
import DeleteApplicationModal from '../components/DeleteApplicationModal';
import useApplicationDetails from '../hooks/useApplicationDetails';
import useApplicationActions from '../hooks/useApplicationActions';
import { downloadAllAttachments } from '../projectsService';
import { formatDateStringSpanish, formatISODateSpanish } from '@/utils/dateUtils';
import useCurrentUser from '@/features/auth/hooks/useCurrentUser';

export default function MyApplicationDetails() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { application, isLoading, error } = useApplicationDetails(uuid);
  const { user } = useCurrentUser();
  const { handleDelete, isDeleting } = useApplicationActions(uuid);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Descargar todos los archivos adjuntos
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

  // Eliminar solicitud
  const confirmDelete = async () => {
    const success = await handleDelete();
    if (success) {
      setShowDeleteModal(false);
      navigate('/my-applications');
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
          <h2 className="text-2xl font-bold text-red-800 mb-2">Solicitud no encontrada</h2>
          <p className="text-red-600 mb-6">{error || 'No se pudo cargar la información de la solicitud'}</p>
          <button
            onClick={() => navigate('/my-applications')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Volver a mis solicitudes
          </button>
        </div>
      </section>
    );
  }

  // Extraer datos de la aplicación
  const {
    title,
    detailedDescription,
    bannerUrl,
    faculties = [],
    author,
    outsider,
    projectTypes = [],
    problemTypes = [],
    status,
    createdAt,
    dueDate,
    attachments = [],
    project,
  } = application || {};

  // Configuración de estados visuales
  const statusConfig = {
    pending: {
      label: 'Pendiente de revisión',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    },
    approved: {
      label: 'Aprobada',
      color: 'bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/20 dark:text-lime-300 dark:border-lime-700',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    rejected: {
      label: 'Rechazada',
      color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
  };

  // Obtener el slug del estado correctamente
  const statusSlug = typeof status === 'object' && status !== null ? status.slug : status;
  const currentStatus = statusConfig[statusSlug] || statusConfig.pending;

  // Permisos de eliminación
  const isAuthor = user === author?.uuid_user;
  const canDelete = isAuthor && (statusSlug !== 'approved' && statusSlug !== 'project_approved');

  // Información del proyecto
  const projectInfo = [
    { 
      label: 'Tipo de proyecto', 
      value: projectTypes.length > 0 
        ? projectTypes.map(pt => pt.name).join(', ')
        : 'No especificado' 
    },
    { 
      label: 'Facultades', 
      value: faculties.length > 0 
        ? faculties.map(f => f.name).join(', ')
        : 'No especificada' 
    },
    { 
      label: 'Tipo de problemática', 
      value: problemTypes.length > 0 
        ? problemTypes.map(pt => pt.name).join(', ')
        : 'No especificado' 
    },
    { 
      label: 'Fecha de vigencia', 
      value: dueDate 
        ? formatDateStringSpanish(dueDate.split('T')[0])
        : 'No especificada'
    },
    { 
      label: 'Fecha de creación', 
      value: createdAt 
        ? formatISODateSpanish(createdAt)
        : 'No especificada'
    },
  ];

  // Manejar contacto con soporte
  // const handleContact = () => {
  //   if (outsider?.email) {
  //     window.location.href = `mailto:${outsider.email}?subject=Consulta sobre solicitud: ${title}`;
  //   } else {
  //     alert('No hay correo de contacto disponible');
  //   }
  // };
  
  return (
    <section className="w-full px-10 py-12">
      {/* Botón de regreso */}
      <button
        onClick={() => navigate('/my-applications')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a mis solicitudes
      </button>

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-4xl font-bold">
          Detalles de mi <span className="text-lime-700">solicitud</span>
        </h1>

        {/* Badge de estado */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${currentStatus.color}`}>
          {currentStatus.icon}
          <span className="font-semibold">{currentStatus.label}</span>
        </div>
      </div>

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

        {/* Columna derecha: Información y acciones */}
        <div className="w-7/12">
          {/* Información del proyecto */}
          <h2 className="text-3xl font-bold mb-3">
            Información del <span className="text-lime-700">proyecto</span>
          </h2>
          <ProjectInfoCard items={projectInfo} />

          {/* Si fue aprobada, mostrar info del proyecto creado */}
          {statusSlug === 'approved' && project && (
            <div className="mt-6 p-4 bg-lime-50 border border-lime-200 rounded-lg dark:bg-lime-900/20 dark:border-lime-700">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-lime-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-lime-800 dark:text-lime-300 mb-2">
                    ¡Tu solicitud fue aprobada!
                  </h3>
                  <p className="text-sm text-lime-700 dark:text-lime-400 mb-3">
                    Esta solicitud se convirtió en un proyecto activo el {formatDateStringSpanish(project.createdAt.split('T')[0])}
                  </p>
                  <button
                    onClick={() => navigate(`/project/${project.uuid_project}`)}
                    className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition text-sm font-semibold"
                  >
                    Ver proyecto activo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col gap-3 pt-6 w-11/12">
            {/* Botón Descargar Todos los Archivos */}
            <button 
              onClick={handleDownloadAll}
              disabled={isDownloadingAll || attachments.length === 0}
              className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 font-semibold transition disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  Descargar todos
                </>
              )}
            </button>

            {/* Mensaje de error si ocurrió */}
            {downloadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {downloadError}
              </div>
            )}
            
            {/* Botón Ponerse en Contacto (solo si está pendiente o rechazada) */}
            {/* {statusSlug !== 'approved' && (
              <button 
                onClick={handleContact}
                disabled={!outsider?.email}
                className="px-4 py-2 border-2 border-lime-600 text-lime-700 font-semibold rounded-lg hover:bg-lime-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Contactar soporte
              </button>
            )} */}

            {/* Nota informativa según estado */}
            {statusSlug === 'pending' && (
              <div className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg text-sm text-yellow-700 flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold mb-1">Solicitud en revisión</p>
                  <p className="text-xs">
                    Un profesor revisará tu solicitud pronto. Recibirás una notificación cuando sea aprobada o si requiere cambios.
                  </p>
                </div>
              </div>
            )}

            {statusSlug === 'rejected' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold mb-1">Solicitud rechazada</p>
                  <p className="text-xs">
                    Esta solicitud no cumplió con los requisitos. Puedes crear una nueva solicitud con las correcciones necesarias.
                  </p>
                </div>
              </div>
            )}

            {/* Botón Eliminar Solicitud */}
            {canDelete && (
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="w-full px-4 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar Solicitud
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de eliminación */}
      <DeleteApplicationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        application={application}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </section>
  );
}
