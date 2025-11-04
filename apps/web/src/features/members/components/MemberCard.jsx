import React from 'react';

const MemberCard = ({ 
  name, 
  position, 
  email, 
  phone, 
  department,
  status = 'active'
}) => {
  // Función para generar las iniciales del nombre
  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2) // Solo las primeras 2 iniciales
      .join('');
  };

  // Función para generar un color de fondo basado en el nombre

  const initials = getInitials(name);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      <div className="relative h-48 bg-gradient-to-br from-lime-400 to-lime-600">
        <div className="absolute inset-0 bg-lime-600 bg-opacity-20"></div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            {/* Avatar con iniciales */}
            <div className={`w-20 h-20 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-lime-300 to-lime-600 flex items-center justify-center`}>
              <span className="text-white font-bold text-xl">
                {initials}
              </span>
            </div>
            {status === 'active' && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 pt-8">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
          <p className="text-lime-600 font-medium">{position}</p>
          {department && (
            <p className="text-gray-500 text-sm mt-1">{department}</p>
          )}
        </div>

        <div className="space-y-3">
          {email && (
            <div className="flex items-center text-gray-600 text-sm gap-3">
              <svg className='text-2xl text-lime-600' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M5 20a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3zM7.625 8.22a1 1 0 1 0-1.25 1.56l3.75 3.001a3 3 0 0 0 3.75 0l3.75-3a1 1 0 1 0-1.25-1.562l-3.75 3a1 1 0 0 1-1.25 0z" clipRule="evenodd"/>
              </svg>
              <span className="truncate">{email}</span>
            </div>
          )}
          
          {phone && (
            <div className="flex items-center text-gray-600 text-sm gap-3">
              <svg className='text-2xl text-lime-600' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <g fill="none">
                  <path fill="currentColor" d="M20 16v4c-2.758 0-5.07-.495-7-1.325c-3.841-1.652-6.176-4.63-7.5-7.675C4.4 8.472 4 5.898 4 4h4l1 4l-3.5 3c1.324 3.045 3.659 6.023 7.5 7.675L16 15z"/>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 18.675c1.93.83 4.242 1.325 7 1.325v-4l-4-1zm0 0C9.159 17.023 6.824 14.045 5.5 11m0 0C4.4 8.472 4 5.898 4 4h4l1 4z"/>
                </g>
              </svg>
              <span>{phone}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {status === 'active' ? 'Activo' : 'Inactivo'}
            </span>
            <div className="flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.854 3.5a.979.979 0 0 0-1.708 0q-.3.546-.577 1.106a27 27 0 0 0-1.48 3.656c-.139.431-.551.73-1.023.743a29.4 29.4 0 0 0-4.267.425c-.774.136-1.065 1.018-.515 1.556q.188.185.38.365a32 32 0 0 0 3.03 2.527c.367.269.518.73.378 1.152a27 27 0 0 0-1.14 4.927c-.1.755.708 1.288 1.41.928a28.6 28.6 0 0 0 3.98-2.472a1.15 1.15 0 0 1 1.356 0a28.5 28.5 0 0 0 3.98 2.472c.701.36 1.51-.173 1.41-.928q-.058-.425-.127-.845a27 27 0 0 0-1.013-4.082c-.14-.422.01-.883.378-1.152a31.5 31.5 0 0 0 3.41-2.892c.55-.538.26-1.42-.515-1.556a29 29 0 0 0-4.267-.425a1.1 1.1 0 0 1-1.023-.743a27 27 0 0 0-2.057-4.761"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;