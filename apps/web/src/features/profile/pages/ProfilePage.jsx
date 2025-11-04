import React, { useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import TabMenu from '../components/TabMenu';
import Overview from '../components/Overview';
import ProjectsTab from '../components/ProjectsTab';
import FeedbackTab from '../components/FeedbackTab';
import EditProfileModal from '../components/EditProfileModal';
import useGetProfile from "../hooks/useGetProfile";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const { profile } = useGetProfile()
  
  return (
    <div className="p-6 w-full mr-5">
      <ProfileHeader
        onEdit={() => setModalOpen(true)}
        profile={profile}
      />
      <TabMenu activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === 'overview' && <Overview profile={profile}/>}
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'feedback' && <FeedbackTab />}
      </div>
      {modalOpen && 
        <EditProfileModal
          onClose={() => setModalOpen(false)}
          profile={profile}
        />
      }
    </div>
  );
}

export default ProfilePage;
