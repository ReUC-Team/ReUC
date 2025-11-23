import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProjectImage from '../components/ProjectImage';
import ProjectSummary from '../components/ProjectSummary';
import ProjectInfoCard from '../components/ProjectInfoCard';
import AttachmentCard from '../components/AttachmentCard';
import EditApplicationModal from '../components/EditApplicationModal';
import useApplicationDetails from '../hooks/useApplicationDetails';
import { downloadAllAttachments, approveApplication } from '../projectsService';
import { Alerts } from '@/shared/alerts';
import { formatDateStringSpanish } from '@/utils/dateUtils';

export default function ApplicationDetails() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { application, isLoading, error, refetch } = useApplicationDetails(uuid);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    refetch();
    Alerts.success("Cambios guardados exitosamente");
  };

  const handleApproveSuccess = (projectUuid) => {
    Alerts.success('¡Proyecto aprobado exitosamente!');
    setTimeout(() => {
      navigate(`/my-projects/${projectUuid}`);
    }, 1500);
  };

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

  // Aprobar proyecto sin modificaciones
  const handleApprove = async () => {
    const result = await Alerts.confirm({
      title: '¿Aprobar este proyecto?',
      text: 'Esta acción creará un nuevo proyecto activo basado en esta solicitud SIN modificaciones.',
      confirmText: 'Sí, aprobar',
      cancelText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsApproving(true);
    
    try {
      const projectTypeIds = application.projectTypes.map(pt => pt.id);
      const facultyIds = application.faculties.map(f => f.id);
      const problemTypeIds = application.problemTypes.map(pt => pt.id);

      if (projectTypeIds.length === 0) {
        Alerts.warning('El proyecto debe tener al menos un tipo de proyecto');
        setIsApproving(false);
        return;
      }
      if (facultyIds.length === 0) {
        Alerts.warning('El proyecto debe tener al menos una facultad');
        setIsApproving(false);
        return;
      }
      if (problemTypeIds.length === 0) {
        Alerts.warning('El proyecto debe tener al menos un tipo de problemática');
        setIsApproving(false);
        return;
      }

      const projectData = {
        title: application.title,
        shortDescription: application.shortDescription,
        description: application.detailedDescription,
        estimatedDate: application.dueDate?.split('T')[0] || null,
        projectType: projectTypeIds,
        faculty: facultyIds,
        problemType: problemTypeIds,
      };

      const loadingAlert = Alerts.loading('Aprobando proyecto...');

      try {
        const response = await approveApplication(uuid, projectData);
        
        loadingAlert.close();

        const projectUuid = response?.project?.uuid_project;

        if (!projectUuid) {
          throw new Error("No se pudo obtener el UUID del proyecto creado");
        }

        Alerts.success('¡Proyecto aprobado exitosamente!');
        
        setTimeout(() => {
          navigate(`/my-projects/${projectUuid}`);
        }, 1500);
        
      } catch (error) {
        loadingAlert.close();
        throw error;
      }
      
    } catch (error) {
      if (error.message) {
        Alerts.error(error.message);
      } else {
        Alerts.error('No se pudo aprobar el proyecto. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsApproving(false);
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
    author,              
    projectTypes = [],
    problemTypes = [],
    status,
    createdAt,
    dueDate,
    attachments = [],
  } = application;

  const authorFirstName = author?.firstName || 'No especificado';
  const authorLastName = author?.lastName || '';
  const authorFullName = `${authorFirstName} ${authorLastName}`.trim();
  const authorEmail = author?.email || null;

  const outsiderData = author?.outsider || null;
  const organizationName = outsiderData?.organizationName || 'N/A';
  const phoneNumber = outsiderData?.phoneNumber || 'N/A';
  const location = outsiderData?.location || 'N/A';

  const isOutsider = !!outsiderData;
  const authorRole = isOutsider ? 'Outsider' : 'Profesor';

  // Información del solicitante
  const applicantInfo = [
    { 
      label: 'Nombre del solicitante', 
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
        value: 'Solicitud creada por un profesor'
      }
    ]),
  ];

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
      label: 'Fecha límite', 
      value: dueDate 
        ? formatDateStringSpanish(dueDate.split('T')[0])
        : 'No especificada'
    },
    { 
      label: 'Fecha de creación', 
      value: createdAt 
        ? formatDateStringSpanish(createdAt.split('T')[0])
        : 'No especificada'
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

  const isAlreadyApproved = application?.status === 'approved';
  
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
          <ProjectImage 
            src={bannerUrl} 
            alt={title} 
          />
          
          <ProjectSummary
            title={title}
            description={detailedDescription}
          />

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
            {/* Primera fila: Editar + Aceptar */}
            <div className='flex gap-5'>
              {/* Botón Editar proyecto */}
              <button 
                onClick={handleEditClick}
                disabled={isApproving || isAlreadyApproved}
                className={`px-4 py-2 rounded-lg font-semibold w-6/12 transition flex items-center justify-center gap-2 ${
                  isAlreadyApproved
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'border-2 border-lime-600 text-lime-700 hover:bg-lime-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isAlreadyApproved ? 'No se puede editar un proyecto aprobado' : 'Editar metadata y aprobar proyecto'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {isAlreadyApproved ? 'Ya aprobado' : 'Editar proyecto'}
              </button>

              {/* Botón Aceptar Proyecto (directo, sin editar) */}
              <button 
                onClick={handleApprove}
                disabled={isApproving || isAlreadyApproved}
                className={`px-4 py-2 rounded-lg font-semibold w-6/12 transition flex items-center justify-center gap-2 ${
                  isAlreadyApproved
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-lime-600 text-white hover:bg-lime-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isAlreadyApproved ? 'Este proyecto ya fue aprobado' : 'Aprobar proyecto sin modificaciones'}
              >
                {isApproving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Aprobando...
                  </>
                ) : isAlreadyApproved ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Ya aprobado
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Aceptar proyecto
                  </>
                )}
              </button>
            </div>
            
            {/* Segunda fila: Descargar todos */}
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

            {/* Mensaje informativo si ya está aprobado */}
            {isAlreadyApproved && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold mb-1">Proyecto ya aprobado</p>
                  <p className="text-xs">
                    Este proyecto ya fue convertido en un proyecto activo. 
                    Puedes encontrarlo en la sección "Mis proyectos".
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edición y aprobación */}
      <EditApplicationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        uuid={uuid}
        application={application}
        onEditSuccess={handleEditSuccess}
        onApproveSuccess={handleApproveSuccess}
      />
    </section>
  );
}
