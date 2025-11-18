import React from "react";

export default function RoleSelector({
  roles,
  selectedRole,
  onRoleChange,
  constraints,
  pendingMembers,
}) {
  // Calcular cuántos miembros de cada rol ya están agregados
  const getRoleCount = (roleId) => {
    return pendingMembers.filter((m) => m.roleId === roleId).length;
  };

  // Formatear el límite máximo
  const formatMaxCount = (maxCount) => {
    if (maxCount === null || maxCount === Infinity) {
      return "∞";
    }
    return maxCount;
  };

  return (
    <div className="relative min-w-[200px]">
      <select
        value={selectedRole || ""}
        onChange={(e) => onRoleChange(Number(e.target.value))}
        className="w-full appearance-none px-4 py-3 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 cursor-pointer"
      >
        {roles.map((role) => {
          const count = getRoleCount(role.id);
          const constraint = constraints[role.name];
          const maxCount = constraint ? formatMaxCount(constraint.max) : "∞";
          const label = `${role.name} (${count}/${maxCount})`;

          return (
            <option key={role.id} value={role.id}>
              {label}
            </option>
          );
        })}
      </select>

      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}