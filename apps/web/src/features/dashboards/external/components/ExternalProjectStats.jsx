import React from 'react';
import ProjectStats from '../../shared/components/ProjectStats';
import { useExternalDashboardStats } from '../hooks/useExternalDashboardStats';

export const ExternalProjectStats = () => {
  const { stats, isLoading } = useExternalDashboardStats();

  const STAT_ICONS = {
    TOTAL: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    ),
    APPROVED: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    PENDING: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    REJECTED: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    RATE: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
      </svg>
    ),
  };

  const statsData = [
    {
      label: 'Total Solicitudes',
      value: stats.totalApplications,
      color: 'from-lime-500 to-lime-600',
      bgColor: 'bg-lime-50 dark:bg-lime-900/30',
      textColor: 'text-lime-600 dark:text-lime-400',
      icon: STAT_ICONS.TOTAL
    },
    {
      label: 'Aprobadas',
      value: stats.approved,
      color: 'from-lime-500 to-lime-600',
      bgColor: 'bg-lime-50 dark:bg-lime-900/30',
      textColor: 'text-lime-600 dark:text-lime-400',
      icon: STAT_ICONS.APPROVED
    },
    {
      label: 'Pendientes',
      value: stats.pending,
      color: 'from-lime-500 to-lime-600',
      bgColor: 'bg-lime-50 dark:bg-lime-900/30',
      textColor: 'text-lime-600 dark:text-lime-400',
      icon: STAT_ICONS.PENDING
    },
    {
      label: 'Rechazadas',
      value: stats.rejected,
      color: 'from-lime-500 to-lime-600',
      bgColor: 'bg-lime-50 dark:bg-lime-900/30',
      textColor: 'text-lime-600 dark:text-lime-400',
      icon: STAT_ICONS.REJECTED
    },
    {
      label: 'Tasa de Aprobación',
      value: `${stats.approvalRate}%`,
      color: 'from-lime-500 to-lime-600',
      bgColor: 'bg-lime-50 dark:bg-lime-900/30',
      textColor: 'text-lime-600 dark:text-lime-400',
      icon: STAT_ICONS.RATE
    }
  ];

  const handleStatClick = (stat) => {
    console.log('External stat clicked:', stat.label);
  };

  return (
    <ProjectStats
      title="Panel de Externo"
      subtitle="Revisa el estado de tus solicitudes y gestiona tus proyectos aprobados."
      statsData={statsData}
      onStatClick={handleStatClick}
      showSummary={true}
      maxValue={Math.max(stats.totalApplications, 10)}
      isLoading={isLoading}
    />
  );
};

export default ExternalProjectStats;