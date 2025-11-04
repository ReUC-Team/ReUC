import ProjectStats from '../components/FacultyProjectStats'
import ProjectList from '../components/PendingRequests'
import Projects from '../../shared/components/Projects'
import UploadedLinks from '../components/UploadedLinks'
import LinkedStudents from '../components/LinkedStudents'
// import Timeline from '@/features/dashboards/dashboard/components/Timeline'


const DashboardFaculty = () => {
  const handleProjectDetails = (project) => {
    console.log('Ver detalles del proyecto:', project)
    // TODO: Implementar navegación a la página de detalles del proyecto
  }

  // Función para manejar el contacto con estudiantes
  const handleContactStudents = (project) => {
    console.log('Contactar estudiantes del proyecto:', project)
    // TODO: Implementar funcionalidad de contacto
  }
  return (
    <>
    <div className="p-4 grid gap-4 xl:grid-cols-3 w-12/12">
      <div className="col-span-3 items-start">
        <ProjectStats />
      </div>
      <div className="col-span-3 lg:col-span-1">
        <ProjectList />
        <div className='mt-5'>
          <LinkedStudents />
        </div>
      </div>
      <div className="col-span-3 lg:col-span-2 grid gap-4">
        <Projects
            dashboardType="faculty"
            onProjectClick={handleProjectDetails}
            onContactStudents={handleContactStudents}
            onUploadComment={(project) => console.log('Subir comentario para el proyecto:', project)}
            onViewDeliverables={(project) => console.log('Ver entregables del proyecto:', project)}
          />
        <div className="grid gap-4">
          <UploadedLinks />
        </div>
      </div>
    </div>
    {/* <Timeline /> */}
    </>
  )
}

export default DashboardFaculty