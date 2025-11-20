import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header/Header'
import Timeline from '@/components/Timeline'

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-x-hidden relative top-25">
          <Outlet />
        </main>
        {/* <Timeline /> */}
      </div>
    </div>
  )
}

export default DashboardLayout
