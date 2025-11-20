import React, { useState } from "react";
import AddMemberForm from "./AddMemberForm.jsx";
import SaveTeamButton from "./SaveTeamButton.jsx";
import useTeamMetadata from "../hooks/useTeamMetadata.js";
import useTeamManagement from "../hooks/useTeamManagement.js";
import { useParams } from "react-router-dom";

export default function EmptyTeamState() {
  const { uuid } = useParams();
  const [showForm, setShowForm] = useState(false);
  const { roles, constraints } = useTeamMetadata(uuid);
  const {
    pendingMembers,
    addMember,
    removeMember,
    updateMemberRole,
    saveTeam,
    isSaving,
  } = useTeamManagement(uuid, roles, constraints);

  if (showForm) {
    return (
      <div className="w-full">
        <AddMemberForm
          roles={roles}
          constraints={constraints}
          pendingMembers={pendingMembers}
          onAddMember={addMember}
          onRemoveMember={removeMember}
          onUpdateMemberRole={updateMemberRole}
        />
        
        {pendingMembers.length > 0 && (
          <SaveTeamButton
            onClick={async () => {
              const success = await saveTeam();
              if (success) {
                window.location.reload();
              }
            }}
            isLoading={isSaving}
            disabled={isSaving}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Este proyecto aún no tiene equipo
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Comienza agregando miembros al proyecto
        </p>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="group relative w-20 h-20 rounded-full bg-lime-600 hover:bg-lime-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110"
        aria-label="Agregar miembro"
      >
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}