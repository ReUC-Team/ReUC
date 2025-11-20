import React from "react";

export default function PendingMemberCard({
  member,
  roles,
  onRemove,
  onUpdateRole,
}) {
  const currentRole = roles.find((r) => r.id === member.roleId);

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-lime-100 dark:bg-lime-900 flex items-center justify-center flex-shrink-0">
        <svg className="w-7 h-7 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="font-semibold text-gray-900 dark:text-gray-100">
          {member.user.firstName} {member.user.lastName}
        </p>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{member.user.email}</span>
        </div>
      </div>

      {/* Selector de Rol */}
      <div className="relative min-w-[150px]">
        <select
          value={member.roleId}
          onChange={(e) => onUpdateRole(member.id, Number(e.target.value))}
          className="w-full appearance-none px-3 py-2 pr-8 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Botón Eliminar */}
      <button
        onClick={() => onRemove(member.id)}
        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        aria-label="Eliminar miembro"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}