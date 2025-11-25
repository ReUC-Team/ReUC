import { Outlet } from 'react-router-dom'
import ExternalHeader from '@/components/ExternalHeader'

const AuthLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <ExternalHeader />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
