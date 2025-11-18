import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTeamData from "../hooks/useTeamData.js";
import useTeamMetadata from "../hooks/useTeamMetadata.js";
import useTeamManagement from "../hooks/useTeamManagement.js";
import EmptyTeamState from "../components/EmptyTeamState.jsx";
import TeamMembersList from "../components/TeamMembersList.jsx";
import AddMemberForm from "../components/AddMemberForm.jsx";
import SaveTeamButton from "../components/SaveTeamButton.jsx";

export default function TeamPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const { team, hasTeam, isLoading: isLoadingTeam, refreshTeam } = useTeamData(uuid);
  const { roles, constraints, isLoading: isLoadingMetadata, error: metadataError } = useTeamMetadata(uuid);
  const {
    pendingMembers,
    isSaving,
    addMember,
    removeMember,
    updateMemberRole,
    saveTeam,
  } = useTeamManagement(uuid, roles, constraints);

  const handleSaveTeam = async () => {
    const success = await saveTeam();
    if (success) {
      // Recargar la página para mostrar el equipo guardado
      window.location.reload();
    }
  };

  const isLoading = isLoadingTeam || isLoadingMetadata;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-lime-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando equipo...</p>
      </div>
    );
  }

  // Error al cargar metadata (crítico)
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

  // Si no hay roles disponibles
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
      {/* Header */}
      <div className="w-full max-w-5xl mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-500 transition mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Volver</span>
        </button>

        <h1 className="text-5xl font-bold">
          Equipo del <span className="text-lime-600">Proyecto</span>
        </h1>
      </div>

      {/* Contenido Principal */}
      <div className="w-full max-w-5xl">
        {!hasTeam && pendingMembers.length === 0 ? (
          // Estado vacío: Botón central +
          <EmptyTeamState />
        ) : (
          <div className="space-y-8">
            {/* Equipo Existente */}
            {hasTeam && (
              <TeamMembersList
                members={team?.members || []}
                roles={roles}
              />
            )}

            {/* Formulario de Agregar Miembros */}
            <AddMemberForm
              roles={roles}
              constraints={constraints}
              pendingMembers={pendingMembers}
              onAddMember={addMember}
              onRemoveMember={removeMember}
              onUpdateMemberRole={updateMemberRole}
            />

            {/* Botón Guardar */}
            {pendingMembers.length > 0 && (
              <SaveTeamButton
                onClick={handleSaveTeam}
                isLoading={isSaving}
                disabled={isSaving}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}