import React from 'react';

const ProfileHeader = ({ onEdit, profile }) => {
  const firstName = profile.firstName || "ReUC";
  const middleName = profile.middleName || "";
  const lastName = profile.lastName || "";
  const location = profile.location || "Mexico";

  const generateAvatarFromName = (name) => {
    if (!name) return '';
    
    const names = name.split(' ');
    const firstName = names[0] || '';
    const lastName = names[names.length - 1] || '';
    const firstInitial = firstName[0] ? firstName[0].toUpperCase() : '';
    const lastInitial = lastName[0] ? lastName[0].toUpperCase() : '';
    return names.length > 1 ? firstInitial + lastInitial : firstInitial;
  };

  return (
    <div className="flex items-center justify-between p-6 rounded-xl">
      <div className="flex items-center gap-6">
        <div className="w-50 h-50 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center text-white font-semibold text-8xl">
          {generateAvatarFromName(`${firstName} ${middleName} ${lastName}`)}
        </div>
        <div className="ml-1">
          <h2 className="text-2xl font-bold">
            {`${firstName} ${middleName} ${lastName}`}
          </h2>
          <p className="text-gray-500">{location}</p>
        </div>
      </div>
      <div className="flex gap-4 w-5/12 justify-end mr-10">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition w-6/12 font-bold"
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
