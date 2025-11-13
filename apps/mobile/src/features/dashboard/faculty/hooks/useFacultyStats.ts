// apps/mobile/src/features/dashboards/faculty/hooks/useFacultyStats.ts

export interface FacultyStat {
  label: string
  value: number | string
  icon: string 
}

export const useFacultyStats = () => {
  const statsData: FacultyStat[] = [
    {
      label: 'Proyectos Asignados',
      value: 8,
      icon: 'folder-multiple'
    },
    {
      label: 'Proyectos en Curso',
      value: 7,
      icon: 'progress-clock'
    },
    {
      label: 'Proyectos Finalizados',
      value: 1,
      icon: 'check-circle'
    },
    {
      label: 'Solicitudes Pendientes',
      value: 12,
      icon: 'alert-circle-outline'
    },
    {
      label: 'Tiempo Promedio',
      value: '6 meses',
      icon: 'clock-outline'
    }
  ]

  return { statsData }
}