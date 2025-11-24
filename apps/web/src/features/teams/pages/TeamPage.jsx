import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTeamData from '../hooks/useTeamData.js';
import useTeamMetadata from '../hooks/useTeamMetadata.js';
import useTeamManagement from '../hooks/useTeamManagement.js';
import EmptyTeamState from '../components/EmptyTeamState.jsx';
import TeamMembersList from '../components/TeamMembersList.jsx';
import AddMemberForm from '../components/AddMemberForm.jsx';
import SaveTeamButton from '../components/SaveTeamButton.jsx';
import useCurrentUser from '../../auth/hooks/useCurrentUser.js';
import useProjectDetails from '@/features/projects/hooks/useProjectDetails';
import useProjectActions from '@/features/projects/hooks/useProjectActions';
import useProjectValidation from '@/features/projects/hooks/useProjectValidation';
import StartProjectModal from '@/features/projects/components/StartProjectModal';
import ProjectStatusBadge from '@/features/projects/components/ProjectStatusBadge';

export default function TeamPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  
  const { user, role, isLoading: isLoadingUser } = useCurrentUser();

  const { team, hasTeam, isLoading: isLoadingTeam, refreshTeam } = useTeamData(uuid);
  const { roles, constraints, isLoading: isLoadingMetadata, error: metadataError } = useTeamMetadata(uuid);
  const {
    pendingMembers,
    isSaving,
    addMember,
    removeMember,
    updateMemberRole,
    saveTeam,
  } = useTeamManagement(uuid, roles, constraints, team?.members || []);

  // Hooks adicionales para proyecto
  const { project, refetch: refetchProject } = useProjectDetails(uuid);
  const validation = useProjectValidation(project, constraints, team?.members);
  const { isStarting, handleStart } = useProjectActions(uuid);
  const [showStartModal, setShowStartModal] = useState(false);

  // Verificar permisos basados en rol
  const isProfessor = role?.name === 'professor' || role?.slug === 'professor';
  const canManageTeam = isProfessor; // Solo profesores pueden modificar el equipo
  const canStart = project?.status?.slug === 'project_approved' && isProfessor;
  const isProjectStarted = project?.status?.slug === 'project_in_progress' || project?.status?.slug === 'completed';

  // Handler para iniciar proyecto
  const confirmStart = async () => {
    const success = await handleStart();
    if (success) {
      setShowStartModal(false);
      await refetchProject();
      await refreshTeam();
      setTimeout(() => {
        refetchProject();
      }, 500);
    }
  };
  const canEdit = isProfessor; // Solo profesores pueden editar el equipo
  
  const handleSaveTeam = async () => {
    const success = await saveTeam();
    if (success) {
      refreshTeam();
    }
  };

  const isLoading = isLoadingTeam || isLoadingMetadata || isLoadingUser;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-lime-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando equipo...</p>
      </div>
    );
  }

  if (metadataError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Error al cargar configuración
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-4">{metadataError}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Configuración de equipo no disponible
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Este tipo de proyecto aún no tiene roles configurados.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center w-full min-h-screen px-10 pt-10 pb-20">
      <div className="w-full max-w-5xl mb-8">
        {/* Header con estado y botón de iniciar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-400 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">Volver</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Badge de estado */}
            {project?.status && (
              <ProjectStatusBadge status={project.status} size="md" />
            )}

            {/* Botón: Iniciar Proyecto */}
            {canStart && (
              <button
                onClick={() => setShowStartModal(true)}
                disabled={!validation.canStart || isStarting}
                className="px-6 py-3 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isStarting ? 'Iniciando...' : 'Iniciar Proyecto'}
              </button>
            )}
          </div>
        </div>

        <h1 className="text-5xl font-bold">
          Equipo del <span className="text-lime-600">Proyecto</span>
        </h1>
        
        {!canEdit && (
          <div className="mt-4 p-3 bg-lime-50 dark:bg-blue-900/20 border border-lime-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-lime-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-lime-700 dark:text-lime-300">
              Estás viendo el equipo en modo solo lectura
            </p>
          </div>
        )}
      </div>

      {/* Mensaje si el proyecto está iniciado */}
      {isProjectStarted && (
        <div className="bg-lime-50 dark:bg-lime-900/20 border-2 border-lime-300 dark:border-lime-700 rounded-lg p-4 mb-6 w-full max-w-5xl">
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
        <div className="bg-lime-50 dark:bg-lime-900/20 border-2 border-lime-300 dark:border-lime-700 rounded-lg p-4 mb-6">
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

      {/* Requisitos del equipo - tooltip informativo */}
      {Object.keys(constraints).length > 0 && !isProjectStarted && (
        <div className="w-full max-w-5xl mb-6">
          <div className="bg-lime-50 dark:bg-lime-900/20 border-2 border-lime-300 dark:border-lime-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-lime-600 dark:text-lime-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-lime-800 dark:text-lime-300 mb-2">
                  Requisitos del equipo para este tipo de proyecto:
                </p>
                <ul className="text-sm text-lime-700 dark:text-lime-400 space-y-1">
                  {Object.entries(constraints).map(([roleName, constraint]) => {
                    const currentCount = team?.members?.filter(m => m.roleName === roleName).length || 0;
                    const isMet = currentCount >= constraint.min;
                    
                    return (
                      <li key={roleName} className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${isMet ? 'text-lime-600 dark:text-lime-400' : 'text-red-400 dark:text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          {isMet ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          )}
                        </svg>
                        <span>
                          <strong>{roleName}</strong>: mínimo {constraint.min}
                          {constraint.max !== Infinity && `, máximo ${constraint.max}`}
                          <span className={`ml-2 font-semibold ${isMet ? 'text-lime-600 dark:text-lime-400' : 'text-red-400 dark:text-red-400'}`}>
                            ({currentCount})
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        {!hasTeam && pendingMembers.length === 0 ? (
          canEdit ? (
            <EmptyTeamState />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Este proyecto aún no tiene equipo
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  El equipo será asignado por el profesor responsable
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-8">
            {hasTeam && (
              <TeamMembersList
                members={team?.members || []}
                roles={roles}
                projectUuid={uuid}
                onRefresh={refreshTeam}
                canEdit={canEdit}
              />
            )}

            {canEdit && (
              <>
                {/* En AddMemberForm, deshabilitar todo el formulario */}
                {!isProjectStarted && (
                  <AddMemberForm
                    roles={roles}
                    constraints={constraints}
                    pendingMembers={pendingMembers}
                    onAddMember={addMember}
                    onRemoveMember={removeMember}
                    onUpdateMemberRole={updateMemberRole}
                  />
                )}

                {/* Mensaje si se intenta editar después de iniciado */}
                {isProjectStarted && (
                  <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                    <p className="font-semibold mb-2">No se puede modificar el equipo</p>
                    <p className="text-sm">El proyecto ha sido iniciado y el equipo está bloqueado.</p>
                  </div>
                )}

                {pendingMembers.length > 0 && (
                  <SaveTeamButton
                    onClick={handleSaveTeam}
                    disabled={isSaving || isProjectStarted}
                    isLoading={isSaving}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal de iniciar proyecto */}
      <StartProjectModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        project={project}
        onConfirm={confirmStart}
        isLoading={isStarting}
      />
    </section>
  );
}