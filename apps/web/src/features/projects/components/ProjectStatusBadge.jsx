import React from 'react';
import { getStatusName, getStatusConfig } from '@/utils/statusUtils';

export default function ProjectStatusBadge({ status, size = 'md', className = '' }) {
  if (!status) return null;

  const slug = typeof status === 'string' ? status : status.slug;
  const name = typeof status === 'object' && status.name ? status.name : getStatusName(slug);
  const config = getStatusConfig(slug);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-xl font-semibold border-2
        ${config.bg} ${config.text} ${config.border}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <span className="w-2 h-2 rounded-full bg-current"></span>
      {name}
    </span>
  );
}