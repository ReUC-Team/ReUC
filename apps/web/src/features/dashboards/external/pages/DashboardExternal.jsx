import React, { useState, useEffect } from 'react'
import ProjectStats from '../components/ExternalProjectStats'
import RequestedProjects from '../components/RequestedProjects'
import Projects from '../../shared/components/Projects'
import RecentActivity from '../components/RecentActivity'
import ProjectSummary from '../components/ProjectSummary'
import { useProfileStatus } from '@/features/profile/hooks/useProfileStatus'
import ProfileIncompleteModal from '@/components/ProfileIncompleteModal'


const DashboardExternal = () => {
  const { isComplete, isLoading } = useProfileStatus();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('dashboardProfileModalShown');

    if (!isLoading && !isComplete && !hasSeenModal) {
      setShowProfileModal(true);
      sessionStorage.setItem('dashboardProfileModalShown', 'true');
    }
  }, [isComplete, isLoading]);

  const handleCloseModal = () => {
    setShowProfileModal(false);
  }

  const handleProjectDetails = (project) => {
    console.log('Ver detalles del proyecto:', project)
    // TODO: Implementar navegación a la página de detalles del proyecto
  }

  const handleContactStudents = (project) => {
    console.log('Contactar estudiantes del proyecto:', project)
    // TODO: Implementar funcionalidad de contacto
  }
  return (
    <>
    <ProfileIncompleteModal 
      isOpen={showProfileModal} 
      onClose={handleCloseModal}
      showCloseButton={true}
      title="¡Completa tu perfil!"
      message="Para aprovechar al máximo la plataforma y poder solicitar proyectos, necesitas completar tu información de perfil."
      subMessage="Esto solo te tomará unos minutos y nos ayuda a conectarte con los mejores proyectos."
    />
    <div className="p-4 grid gap-4 xl:grid-cols-3 w-12/12">
      <div className="col-span-3 items-start">
        <ProjectStats />
      </div>
      <div className="col-span-3 lg:col-span-1">
        <RequestedProjects />
        <div className='mt-5'>
          <ProjectSummary />
        </div>
      </div>
      <div className="col-span-3 lg:col-span-2 grid gap-4">
        <Projects
            dashboardType="external"
            onProjectClick={handleProjectDetails}
            onContactStudents={handleContactStudents}
            onUploadComment={(project) => console.log('Subir comentario para el proyecto:', project)}
            onViewDeliverables={(project) => console.log('Ver entregables del proyecto:', project)}
          />
        <div className=" gap-4">
          <RecentActivity />
        </div>
      </div>
    </div>
    </>
  )
}

export default DashboardExternal