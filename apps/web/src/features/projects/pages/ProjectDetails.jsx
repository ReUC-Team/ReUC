import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProjectImage from '../components/ProjectImage';
import ProjectSummary from '../components/ProjectSummary';
import ProjectInfoCard from '../components/ProjectInfoCard';
import AttachmentCard from '../components/AttachmentCard';
import useProjectDetails from '../hooks/useProjectDetails';
import useProjectActions from '@/features/projects/hooks/useProjectActions';
import useProjectValidation from '@/features/projects/hooks/useProjectValidation';
import useTeamMetadata from '@/features/teams/hooks/useTeamMetadata';
import ProjectStatusBadge from '../components/ProjectStatusBadge';
import StartProjectModal from '../components/StartProjectModal';
import RollbackProjectModal from '../components/RollbackProjectModal';
import UpdateDeadlineModal from '../components/UpdateDeadlineModal';
import { downloadAllAttachments } from '../projectsService';
import { formatDateStringSpanish } from '@/utils/dateUtils';

export default function ProjectDetails() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { project, isLoading, error, refetch } = useProjectDetails(uuid);
  const { constraints } = useTeamMetadata(uuid);
  const validation = useProjectValidation(project, constraints);
  const {
    isStarting,
    isRollingBack,
    isUpdatingDeadline,
    handleStart,
    handleRollback,
    handleUpdateDeadline
  } = useProjectActions(uuid);

  const [showStartModal, setShowStartModal] = useState(false);
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [showUpdateDeadlineModal, setShowUpdateDeadlineModal] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  // Permisos
  const isCreator = true;
  const canStart = project?.status?.slug === 'project_approved' && isCreator;
  const isProjectStarted = project?.status?.slug === 'project_in_progress' || project?.status?.slug === 'completed';
  const canRollback = isCreator && (project?.status?.slug === 'project_in_progress' || project?.status?.slug === 'completed');
  const canUpdateDeadline = isCreator && !isRollingBack && !isStarting;

  // Descargar todos los archivos adjuntos
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

  // Handler para iniciar proyecto
  const confirmStart = async () => {
    const success = await handleStart();
    if (success) {
      setShowStartModal(false);
      // Esperar refetch para asegurar que la UI se actualiza
      await refetch();
      // Forzar actualización adicional después de un pequeño delay
      setTimeout(() => {
        refetch();
      }, 500);
    }
  };

  // Handler para rollback
  const confirmRollback = async () => {
    const success = await handleRollback();
    if (success) {
      setShowRollbackModal(false);
      navigate('/my-applications');
    }
  };

  // Handler para actualizar deadline
  const confirmUpdateDeadline = async (newDeadline) => {
    const success = await handleUpdateDeadline(newDeadline);
    if (success) {
      setShowUpdateDeadlineModal(false);
      await refetch();
      setTimeout(() => {
        refetch();
      }, 500);
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
    teamMembers = [],
    attachments = [],
  } = project;

  // Obtener datos del autor
  const authorFirstName = author?.firstName || 'No especificado';
  const authorLastName = author?.lastName || '';
  const authorFullName = `${authorFirstName} ${authorLastName}`.trim();
  const authorEmail = author?.email || null;

  // Información del autor
  const authorInfo = [
    { label: 'Nombre', value: author?.fullName || 'No especificado' },
    { label: 'Correo', value: author?.email || 'No especificado' },
    { label: 'Matrícula', value: author?.universityId || 'No especificada' },
    { label: 'Tipo de usuario', value: author?.roleName === 'professor' ? 'Profesor' :
      author?.roleName === 'student' ? 'Estudiante' :
      author?.roleName === 'outsider' ? 'Externo' :
      author?.roleName || 'No especificado'
    },
    ...(author?.outsider ? [
      { label: 'Organización', value: author.outsider.organizationName },
      { label: 'Teléfono', value: author.outsider.phoneNumber },
      { label: 'Ubicación', value: author.outsider.location },
    ] : [
      { label: 'Información', value: author?.roleName === 'professor'
        ? 'Proyecto creado por un profesor'
        : author?.roleName === 'student'
        ? 'Proyecto creado por un estudiante'
        : 'Proyecto creado por un usuario externo'
      }
    ])
  ];

  // Información del proyecto
  const projectInfo = [
    { label: 'Tipo de proyecto', value: projectTypes.length > 0 ? projectTypes.map(pt => pt.name).join(', ') : 'No especificado' },
    { label: 'Facultades', value: faculties.length > 0 ? faculties.map(f => f.name).join(', ') : 'No especificada' },
    { label: 'Tipo de problemática', value: problemTypes.length > 0 ? problemTypes.map(pt => pt.name).join(', ') : 'No especificado' },
    { label: 'Fecha límite', value: estimatedDate ? formatDateStringSpanish(estimatedDate.split('T')[0]) : 'No especificada' },
    { label: 'Fecha de creación', value: createdAt ? formatDateStringSpanish(createdAt.split('T')[0]) : 'No especificada' },
    { label: 'Estado', value: status?.name || 'Aprobado' },
  ];

  // Información del equipo
  const teamInfo = teamMembers.map(member => ({
    label: member.role || 'Miembro',
    value: `${member.fullName || 'Sin nombre'} (${member.email}) - ${member.universityId || 'Sin matrícula'}`
  }));

  // Manejar contacto con el autor
  // const handleContact = () => {
  //   if (authorEmail) {
  //     window.location.href = `mailto:${authorEmail}?subject=Consulta sobre proyecto: ${title}`;
  //   } else {
  //     alert('No hay correo de contacto disponible para este proyecto');
  //   }
  // };

  return (
    <section className="w-full px-10 py-12">
      {/* Header con badge de estado */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/my-projects')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a mis proyectos
        </button>
        <div className="flex items-center gap-3 mr-15">
          {status && (
            <ProjectStatusBadge status={status} size="lg" />
          )}
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-6">
        Detalles del <span className="text-lime-700">proyecto</span>
      </h1>

      <div className='flex mt-10 gap-6'>
        {/* Columna izquierda: Imagen, descripción y archivos adjuntos */}
        <div className="w-5/12">
          <ProjectImage src={bannerUrl} alt={title} />
          <ProjectSummary title={title} description={description || shortDescription} />
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
              {/* Botón Descargar Todos los Archivos */}
            <button 
              onClick={handleDownloadAll}
              disabled={isDownloadingAll || attachments.length === 0}
              className="px-4 py-2 bg-lime-700 text-white rounded-lg hover:bg-gray-700 font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 w-11/12 mr-10"
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
            </div>
          )}
        </div>

        {/* Columna derecha: Información y acciones */}
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

          {/* Sección de Equipo (si hay miembros) */}
          {/* {teamMembers && teamMembers.length > 0 && (
            <>
              <h2 className="text-3xl font-bold mb-3 mt-8">
                Equipo del <span className="text-lime-700">proyecto</span>
              </h2>
              <ProjectInfoCard items={teamInfo} />
            </>
          )} */}

          {/* Botones de acción */}
          <div className="flex flex-col gap-3 pt-6 w-11/12">

            {/* Botón Ver Equipo */}
            <button
              onClick={() => navigate(`/my-projects/${uuid}/team`)}
              className="px-6 py-3 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition font-semibold flex items-center justify-center gap-2"
              title="Ver y gestionar el equipo del proyecto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Ver Equipo
            </button>

            {/* Botón Iniciar Proyecto */}
            {project?.status?.slug === 'project_approved' && (
              <button
                onClick={() => {
                  if (isCreator && validation.canStart && !isStarting) {
                    setShowStartModal(true);
                  }
                }}
                disabled={!isCreator || !validation.canStart || isStarting}
                className="px-6 py-3 bg-lime-700 text-white rounded-lg hover:bg-lime-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                title={
                  !isCreator
                    ? 'Solo el creador puede iniciar el proyecto'
                    : !validation.canStart
                    ? 'El equipo no cumple los requisitos'
                    : isStarting
                    ? 'Iniciando...'
                    : 'Iniciar Proyecto'
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isStarting ? 'Iniciando...' : 'Iniciar Proyecto'}
              </button>
            )}

            {/* Botón Rollback */}
            {canRollback && (
              <button
                onClick={() => setShowRollbackModal(true)}
                disabled={isRollingBack}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {isRollingBack ? 'Revirtiendo...' : 'Revertir Proyecto'}
              </button>
            )}

            {/* Botón Actualizar Fecha Límite */}
            {canUpdateDeadline && (
              <button
                onClick={() => setShowUpdateDeadlineModal(true)}
                disabled={isUpdatingDeadline}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#ffffff" d="M12 21q-1.875 0-3.512-.712t-2.85-1.925t-1.925-2.85T3 12t.713-3.512t1.924-2.85t2.85-1.925T12 3q2.05 0 3.888.875T19 6.35V4h2v6h-6V8h2.75q-1.025-1.4-2.525-2.2T12 5Q9.075 5 7.038 7.038T5 12t2.038 4.963T12 19q2.625 0 4.588-1.7T18.9 13h2.05q-.375 3.425-2.937 5.713T12 21m2.8-4.8L11 12.4V7h2v4.6l3.2 3.2z"/></svg>
                {isUpdatingDeadline ? 'Actualizando...' : 'Actualizar Fecha Límite'}
              </button>
            )}

            {/* Botón Ponerse en Contacto */}
            {/* <button 
              onClick={handleContact}
              disabled={!authorEmail}
              className="px-4 py-2 border-2 border-lime-600 text-lime-700 font-semibold rounded-lg hover:bg-lime-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title={!authorEmail ? 'No hay correo de contacto disponible' : `Contactar a ${authorFullName}`}
            >
              Ponerse en contacto
            </button> */}

            {/* Mensaje informativo si el proyecto está iniciado */}
            {isProjectStarted && (
              <div className="bg-lime-50 dark:bg-lime-900/20 border-2 border-lime-300 dark:border-lime-700 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-lime-600 dark:text-lime-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-lime-800 dark:text-lime-300 mb-1">
                      Proyecto en progreso
                    </p>
                    <p className="text-sm text-lime-700 dark:text-lime-400">
                      El equipo ya no puede ser modificado porque el proyecto ha sido iniciado.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Advertencia si el equipo no está completo */}
            {canStart && !validation.canStart && (
              <div className="bg-lime-50 dark:bg-lime-900/20 border-2 border-lime-300 dark:border-lime-700 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-lime-600 dark:text-lime-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-lime-800 dark:text-lime-300 mb-1">
                      Equipo incompleto
                    </p>
                    <p className="text-sm text-lime-700 dark:text-lime-400 mb-2">
                      Complete el equipo según las restricciones para poder iniciar el proyecto:
                    </p>
                    <ul className="text-sm text-lime-700 dark:text-lime-400 list-disc list-inside space-y-1">
                      {validation.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <StartProjectModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        project={project}
        onConfirm={confirmStart}
        isLoading={isStarting}
      />
      <RollbackProjectModal
        isOpen={showRollbackModal}
        onClose={() => setShowRollbackModal(false)}
        project={project}
        onConfirm={confirmRollback}
        isLoading={isRollingBack}
      />
      <UpdateDeadlineModal
        isOpen={showUpdateDeadlineModal}
        onClose={() => setShowUpdateDeadlineModal(false)}
        project={project}
        onConfirm={confirmUpdateDeadline}
        isLoading={isUpdatingDeadline}
      />
    </section>
  );
}