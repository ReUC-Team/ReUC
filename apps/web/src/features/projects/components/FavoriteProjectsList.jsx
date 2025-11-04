import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import projectImage from '@/assets/project.webp'


const FavoriteProjectsList = () => {
  const [search, setSearch] = useState('');
  return (
    <div className="w-full flex flex-col items-center">
      <input
        type="text"
        placeholder="Buscar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-96 px-5 py-3 rounded-full border border-gray-300 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
      />


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-11/12 mb-10">
        <ProjectCard image={projectImage} title='Aplicacion movil para cocina' description='Aplicacion movil de recetario para los estudiantes de la carrera de gastronomia' />
        <ProjectCard image={projectImage} title='Aplicacion movil para cocina' description='Aplicacion movil de recetario para los estudiantes de la carrera de gastronomia' />
      </div>
    </div>
  );
};

export default FavoriteProjectsList;
