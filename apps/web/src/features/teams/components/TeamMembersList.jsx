import React, { useState } from "react";
import { Alerts } from "../../../shared/alerts.js";
import Swal from "sweetalert2";
import { getDisplayMessage } from "../../../utils/errorHandler.js";
import { updateTeamMemberRole, deleteTeamMember } from "../teamsService.js";

export default function TeamMembersList({ members, roles, projectUuid, onRefresh, canEdit = true }) {
  const [editingMember, setEditingMember] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const getRoleIdByName = (roleName) => {
    return roles.find((r) => r.name === roleName)?.id || null;
  };

  const generateAvatarFromName = (firstName, middleName, lastName) => {
    if (!firstName && !middleName && !lastName) return 'U';
    
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    
    return first + last || first || 'U';
  };

  const handleEditClick = (member) => {
    const roleId = getRoleIdByName(member.roleName);
    setEditingMember(member.uuidUser);
    setSelectedRoleId(roleId);
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setSelectedRoleId(null);
  };

  const handleSaveEdit = async (memberUuid) => {
    if (!selectedRoleId) {
      Alerts.warning("Debes seleccionar un rol");
      return;
    }

    setIsUpdating(true);

    try {
      await updateTeamMemberRole(projectUuid, memberUuid, selectedRoleId);
      Alerts.success("Rol actualizado exitosamente");
      setEditingMember(null);
      setSelectedRoleId(null);
      onRefresh();
    } catch (err) {
      console.error("Error updating member role:", err);
      const errorMessage = getDisplayMessage(err);
      Alerts.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (memberUuid, memberName) => {
    const result = await Swal.fire({
      title: '¿Eliminar miembro?',
      html: `¿Estás seguro de eliminar a <strong>${memberName}</strong> del equipo?<br><small class="text-gray-500">Esta acción no se puede deshacer.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626', // red-600
      cancelButtonColor: '#6b7280', // gray-500
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTeamMember(projectUuid, memberUuid);
      
      Swal.fire({
        title: '¡Eliminado!',
        text: `${memberName} fue eliminado del equipo.`,
        icon: 'success',
        confirmButtonColor: '#84cc16', // lime-500
        timer: 2000,
        timerProgressBar: true,
      });
            onRefresh();
    } catch (err) {
      console.error("Error deleting member:", err);
      const errorMessage = getDisplayMessage(err);
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#84cc16',
      });
    }
  };

  const getRoleIcon = (roleName) => {
    const lowerName = roleName.toLowerCase();
    if (lowerName.includes("supervisor") || lowerName.includes("advisor") || lowerName.includes("asesor")) {
      return (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></g></svg>
    );
  };

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center w-fit rounded-lg">
        <h4 className="bg-gray-600 text-lg font-semibold text-white dark:text-gray-200 border-2 rounded-l-lg border-white p-2">
          Miembros del Equipo
        </h4>
        <h4 className="bg-lime-600 text-lg font-semibold text-white dark:text-gray-200 border-2 rounded-r-lg border-white p-2 px-4">
          {members.length}
        </h4>
      </div> */}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Miembros del Equipo ({members.length})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => {
          const isEditing = editingMember === member.uuidUser;
          const fullName = `${member.firstName} ${member.lastName}`.trim();
          
          const avatarInitials = generateAvatarFromName(
            member.firstName,
            member.middleName,
            member.lastName
          );

          return (
            <div
              key={member.uuidUser}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {avatarInitials}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {fullName}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{member.email}</span>
                </div>
              </div>

              {/* Rol Badge o Selector */}
              {isEditing && canEdit ? (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRoleId || ""}
                    onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                    className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
                    disabled={isUpdating}
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleSaveEdit(member.uuidUser)}
                    disabled={isUpdating}
                    className="p-1.5 text-lime-600 hover:bg-lime-50 rounded transition"
                    title="Guardar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition"
                    title="Cancelar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-br from-lime-500 to-lime-700 dark:bg-lime-900 text-white dark:text-lime-300 rounded-lg text-sm font-medium shadow-lg ">
                    {getRoleIcon(member.roleName)}
                    <span>{member.roleName}</span>
                  </div>

                  {/* Solo mostrar botones si puede editar */}
                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(member)}
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition cursor-pointer"
                        title="Editar rol"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(member.uuidUser, fullName)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Eliminar miembro"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}