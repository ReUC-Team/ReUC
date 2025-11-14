import React, { useState } from 'react';
import projectImage from '@/assets/project2.webp'

const ProjectCard = ({ uuid, title, description, image, isFavorite = false, onFavoriteToggle, onDetailsClick }) => {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = () => {
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    
    if (onFavoriteToggle) {
      onFavoriteToggle(newFavoriteState, uuid);
    }
  };

  const handleDetailsClick = () => {
    if (onDetailsClick) {
      onDetailsClick(uuid);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-2 w-full relative hover:shadow-xl transition-shadow duration-300">
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
        aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className={`transition-colors duration-200 ${
            favorite ? 'fill-yellow-400 stroke-yellow-400' : 'fill-none stroke-gray-400'
          }`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      </button>

      <img
        src={image || projectImage}
        alt={title}
        className="w-full h-52 object-cover rounded-xl mb-4"
        onError={(e) => {
          e.target.src = projectImage;
        }}
      />
      
      <div className='p-3'>
        <h3 className="font-bold text-xl mb-1 line-clamp-2">{title}</h3>
        <p className="text-md text-gray-700 mb-4 line-clamp-3">{description}</p>
        <button
          onClick={handleDetailsClick}
          className="inline-block bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-lime-700 transition w-full"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;