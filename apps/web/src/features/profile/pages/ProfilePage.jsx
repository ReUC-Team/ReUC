import React, { useState } from 'react';
import { useAccessibility } from '@/context/AccesibilityContext';
import useGetProfile from '../hooks/useGetProfile';
import ProfileHeader from '../components/ProfileHeader';
import TabMenu from '../components/TabMenu';
import Overview from '../components/Overview';
import ProjectsTab from '../components/ProjectsTab';
import EditProfileModal from '../components/EditProfileModal';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const { profile, isLoading } = useGetProfile();
  const { isDark } = useAccessibility();

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600"></div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del perfil */}
        <ProfileHeader 
          onEdit={() => setModalOpen(true)} 
          profile={profile} 
        />

        {/* Tabs */}
        <TabMenu 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />

        {/* Contenido según tab activo */}
        <div className="mt-6">
          {activeTab === 'overview' && <Overview profile={profile} />}
          {activeTab === 'projects' && <ProjectsTab />}
        </div>

        {/* Modal de edición */}
        {modalOpen && (
          <EditProfileModal 
            onClose={() => setModalOpen(false)} 
            profile={profile} 
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;