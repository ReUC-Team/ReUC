import ProjectStats from '../components/FacultyProjectStats';
import ProjectList from '../components/PendingRequests';
import Projects from '../../shared/components/Projects';
import { useNavigate } from 'react-router-dom';

const DashboardFaculty = () => {
  const navigate = useNavigate();

  const handleProjectDetails = (project) => {
    navigate(`/my-projects/${project.uuid_project}`);
  };

  const handleViewTeam = (project) => {
    navigate(`/my-projects/${project.uuid_project}/team`);
  };

  return (
    <>
      <div className="p-4 grid gap-4 xl:grid-cols-3 w-12/12">
        <div className="col-span-3 items-start">
          <ProjectStats />
        </div>
        
        <div className="col-span-3 lg:col-span-1">
          <ProjectList />
        </div>
        
        <div className="col-span-3 lg:col-span-2 grid gap-4">
          <Projects
            dashboardType="faculty"
            onProjectClick={handleProjectDetails}
            onViewTeam={handleViewTeam}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardFaculty;