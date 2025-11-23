import React from 'react';
import projectImage from '@/assets/project2.webp';
import ProjectStatusBadge from './ProjectStatusBadge';

const ProjectCard = ({ 
  uuid, 
  title, 
  description, 
  image, 
  status,
  onDetailsClick,
  showTeamButton = false,
  onTeamClick
}) => {
  const handleDetailsClick = () => {
    if (onDetailsClick) {
      onDetailsClick(uuid);
    }
  };

  const handleTeamClick = () => {
    if (onTeamClick) {
      onTeamClick(uuid);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-2 w-full relative hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Contenedor de imagen con overlay y badge */}
      <div className="relative w-full h-52 mb-4 group">
        <img
          src={image || projectImage}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            e.target.src = projectImage;
          }}
        />
        <div className="absolute inset-0 bg-black/15 rounded-xl pointer-events-none" />
        
        {/* Badge de estado */}
        {status && (
          <div className="absolute top-3 right-3 z-10">
            <ProjectStatusBadge status={status} size="sm" />
          </div>
        )}
      </div>
      
      <div className='p-3 flex flex-col flex-grow'>
        <h3 className="font-bold text-xl mb-2 line-clamp-2">{title}</h3>
        <p className="text-md text-gray-700 mb-6 line-clamp-3 flex-grow">{description}</p>
        
        <div className={`flex gap-3 mt-auto ${showTeamButton ? 'flex-row' : ''}`}>
          <button
            onClick={handleDetailsClick}
            className={`inline-block bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-lime-700 transition ${
              showTeamButton ? 'flex-1' : 'w-full'
            }`}
          >
            Detalles
          </button>

          {showTeamButton && (
            <button
              onClick={handleTeamClick}
              className="inline-flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition flex-1"
              aria-label="Ver equipo del proyecto"
            >
              <span>Equipo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;