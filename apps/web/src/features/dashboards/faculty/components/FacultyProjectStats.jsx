import React from 'react';
import ProjectStats from '../../shared/components/ProjectStats';
import { useFacultyDashboardStats } from '../hooks/useFacultyDashboardStats';

export const FacultyProjectStats = () => {
  const { stats, isLoading } = useFacultyDashboardStats();

  const STAT_ICONS = {
    PENDING: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    IN_PROGRESS: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    COMPLETED: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    TOTAL: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>
    ),
    APPROVED: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  };

  const statsData = [
    {
      label: 'Solicitudes Pendientes',
      value: stats.pendingApplications,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400',
      icon: STAT_ICONS.PENDING
    },
    {
      label: 'Total Proyectos',
      value: stats.totalProjects,
      color: 'from-lime-500 to-lime-600',
      bgColor: 'bg-lime-50 dark:bg-lime-900/30',
      textColor: 'text-lime-600 dark:text-lime-400',
      icon: STAT_ICONS.TOTAL
    },
    {
      label: 'En Progreso',
      value: stats.byStatus.inProgress,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
      icon: STAT_ICONS.IN_PROGRESS
    },
    {
      label: 'Completados',
      value: stats.byStatus.completed,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
      icon: STAT_ICONS.COMPLETED
    },
    {
      label: 'Aprobados',
      value: stats.byStatus.approved,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400',
      icon: STAT_ICONS.APPROVED
    }
  ];

  const handleStatClick = (stat) => {
    console.log('Faculty stat clicked:', stat.label);
  };

  return (
    <ProjectStats
      title="Panel Académico"
      subtitle="Supervisa, acompaña y gestiona los proyectos asignados a tu coordinación."
      statsData={statsData}
      onStatClick={handleStatClick}
      showSummary={true}
      maxValue={Math.max(stats.totalProjects, stats.pendingApplications, 12)}
      isLoading={isLoading}
    />
  );
};

export default FacultyProjectStats;