import React, { useState, useEffect } from 'react';
import ProjectStats from '../components/ExternalProjectStats';
import RequestedProjects from '../components/RequestedProjects';
import Projects from '../../shared/components/Projects';
import ProjectSummary from '../components/ProjectSummary';
import { useProfileStatus } from '@/features/profile/hooks/useProfileStatus';
import ProfileIncompleteModal from '@/components/ProfileIncompleteModal';
import { useNavigate } from 'react-router-dom';

const DashboardExternal = () => {
  const { isComplete, isLoading } = useProfileStatus();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('dashboardProfileModalShown');

    if (!isLoading && !isComplete && !hasSeenModal) {
      setShowProfileModal(true);
      sessionStorage.setItem('dashboardProfileModalShown', 'true');
    }
  }, [isComplete, isLoading]);

  const handleCloseModal = () => {
    setShowProfileModal(false);
  };

  const handleProjectDetails = (project) => {
    navigate(`/my-projects/${project.uuid_project}`);
  };

  const handleViewTeam = (project) => {
    navigate(`/my-projects/${project.uuid_project}/team`);
  };

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
            onViewTeam={handleViewTeam}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardExternal;