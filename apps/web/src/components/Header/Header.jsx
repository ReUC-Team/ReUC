import { Link } from 'react-router-dom';
import { useState } from 'react';
import LogoUDC from '@/assets/logo-udc.png';
import NotificacionDropdown from './NotificationDropdown';
import MessageDropdown from './MessageDropdown';
import useGetProfile from '@/features/profile/hooks/useGetProfile';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const { profile } = useGetProfile();

  const generateAvatarFromName = (firstName, middleName, lastName) => {
    if (!firstName && !middleName && !lastName) return 'U';
    
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    
    return first + last || first || 'U';
  };

  const avatarInitials = generateAvatarFromName(
    profile.firstName,
    profile.middleName,
    profile.lastName
  );

  return (
    <>
    <header className="w-full flex items-center justify-between px-6 py-3 shadow-md bg-white">
      <Link to="/dashboard">
        <img
          src={LogoUDC}
          alt="Logo UCOL"
          className="w-52 object-contain"
          />
      </Link>

      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-5/12">
        <svg className='text-4xl' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10 18a7.95 7.95 0 0 0 4.897-1.688l4.396 4.396l1.414-1.414l-4.396-4.396A7.95 7.95 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8s3.589 8 8 8m0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6s-6-2.691-6-6s2.691-6 6-6"/></svg>
        <input
          type="text"
          placeholder="Buscar"
          className="bg-transparent outline-none px-2 w-full text-sm"
          />
      </div>
      

      <div className="flex items-center gap-4">

      <button onClick={() => setShowMessage (!showMessage)} type="button" class="relative inline-flex items-center p-3 pr-0 text-sm font-medium text-center rounded-lg cursor-pointer">
        <svg className='text-4xl' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 18h2v4.081L11.101 18H16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2"/><path fill="currentColor" d="M20 2H8c-1.103 0-2 .897-2 2h12c1.103 0 2 .897 2 2v8c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2"/></svg>
        <span class="sr-only">Notifications</span>
          <div class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-red-600 rounded-full -top-0 -end-3">2</div>
        </button>

      <button onClick={() => setShowNotifications(!showNotifications)} type="button" class="relative inline-flex items-center p-3 pl-2 text-sm font-medium text-center rounded-lg cursor-pointer">
        <svg className="text-4xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#333333" d="M12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22m7-7.414V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v4.586l-1.707 1.707A1 1 0 0 0 3 17v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1a1 1 0 0 0-.293-.707z"/></svg> 
        
        <span className="sr-only">Notifications</span>
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-red-600 rounded-full top-0 -end-0">2</div>
        </button> 
        
          <Link 
            to="/profile"
            className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center text-white font-bold text-lg hover:opacity-90 transition"
            title={`${profile.firstName || ''} ${profile.middleName || ''} ${profile.lastName || ''}`.trim() || 'Mi perfil'}
          >
            {avatarInitials}
          </Link>
      </div>
    </header>
    {showNotifications && <NotificacionDropdown />}
    {showMessage && <MessageDropdown />}
    </>
  );
}
