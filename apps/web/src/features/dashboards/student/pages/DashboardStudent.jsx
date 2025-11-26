import ActiveProjects from '../components/ActiveProjects';
import Projects from '../../shared/components/Projects';
import ParticipationSummary from '../components/ParticipationSummary';
import { useNavigate } from 'react-router-dom';

const DashboardStudent = () => {
  const navigate = useNavigate();

  const handleProjectDetails = (project) => {
    console.log("🔍 Dashboard Student - Navegando a proyecto:", project);
    console.log("🔍 UUID del proyecto:", project.uuid_project);
    navigate(`/my-projects/${project.uuid_project}`);
  };

  return (
    <>
      <div className="p-4 grid gap-4 xl:grid-cols-3 w-12/12">
        <div className="col-span-3 items-start">
          <ActiveProjects />
        </div>
        
        <div className="col-span-3 lg:col-span-1">
          <div className="w-full">
            <ParticipationSummary />
          </div>
        </div>
        
        <div className="col-span-3 lg:col-span-2 grid gap-4 h-fit">
          <Projects
            dashboardType="student"
            onProjectClick={handleProjectDetails}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardStudent;