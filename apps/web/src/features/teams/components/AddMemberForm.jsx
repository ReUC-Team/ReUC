import React, { useState } from "react";
import MemberSearchInput from "./MemberSearchInput.jsx";
import RoleSelector from "./RoleSelector.jsx";
import PendingMemberCard from "./PendingMemberCard.jsx";
import useSearchMembers from "../hooks/useSearchMembers.js";

export default function AddMemberForm({
  roles,
  constraints,
  pendingMembers,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
}) {
  const [selectedRole, setSelectedRole] = useState(roles[0]?.id || null);
  const [showInput, setShowInput] = useState(false);

  const {
    searchTerm,
    results,
    isSearching,
    isOpen,
    selectedIndex,
    searchRef,
    handleSearch,
    handleSelect,
    handleFocus,
    handleMouseEnter,
    clearSearch,
  } = useSearchMembers();

  const handleMemberSelect = (member) => {
    const selected = handleSelect(member);
    
    if (selectedRole) {
      const success = onAddMember(selected, selectedRole);
      if (success) {
        // Mantener el input visible para agregar más
        setShowInput(true);
      }
    }
  };

  const handleAddClick = () => {
    setShowInput(true);
  };

  const handleHideInput = () => {
    setShowInput(false);
    clearSearch();
  };

  // Actualizar selectedRole cuando cambien los roles disponibles
  React.useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0].id);
    }
  }, [roles, selectedRole]);

  return (
    <div className="w-full space-y-6">
      {/* Miembros Pendientes */}
      {pendingMembers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Miembros a Agregar ({pendingMembers.length})
          </h3>
          
          <div className="space-y-3">
            {pendingMembers.map((member) => (
              <PendingMemberCard
                key={member.id}
                member={member}
                roles={roles}
                onRemove={onRemoveMember}
                onUpdateRole={onUpdateMemberRole}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input de Búsqueda + Dropdown de Roles */}
      {showInput && (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            {/* Búsqueda */}
            <div className="flex-1" ref={searchRef}>
              <MemberSearchInput
                searchTerm={searchTerm}
                results={results}
                isSearching={isSearching}
                isOpen={isOpen}
                selectedIndex={selectedIndex}
                onSearch={handleSearch}
                onSelect={handleMemberSelect}
                onFocus={handleFocus}
                onMouseEnter={handleMouseEnter}
              />
            </div>

            {/* Selector de Rol */}
            <RoleSelector
              roles={roles}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              constraints={constraints}
              pendingMembers={pendingMembers}
            />
          </div>

          {/* Botón para ocultar input */}
          <div className="flex justify-center">
            <button
              onClick={handleHideInput}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-500 transition"
            >
              Ocultar búsqueda
            </button>
          </div>
        </div>
      )}

      {/* Botón + para mostrar input */}
      {!showInput && (
        <div className="flex justify-center">
          <button
            onClick={handleAddClick}
            className="group relative w-16 h-16 rounded-full bg-lime-600 hover:bg-lime-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110"
            aria-label="Agregar miembro"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}