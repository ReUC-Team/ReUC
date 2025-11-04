import React, { useState } from 'react';
import MemberCard from './MemberCard';



const MembersList = () => {
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
<MemberCard
  name="Juan Pérez"
  position="Encargado de Tesis"
  department="App movil de cocina"
  email="juan.perez@empresa.com"
  phone="+52 312 123-4567"
  status="active"
/>
        <MemberCard 
          image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          name="Juan Pérez"
          position="Encargado de Servicio Social"
          department="Sistema de gestión de proyectos"
          email="juan.perez@empresa.com"
          phone="+52 312 123-4567"
          location="Manzanillo, Colima"
          joinDate="Enero 2023"
          status="active"
        />
        <MemberCard 
          image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          name="Juan Pérez"
          position="Encargado de Servicio Social"
          department="Sistema de gestión de proyectos"
          email="juan.perez@empresa.com"
          phone="+52 312 123-4567"
          location="Manzanillo, Colima"
          joinDate="Enero 2023"
          status="active"
        />
        <MemberCard 
          image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          name="Juan Pérez"
          position="Encargado de Servicio Social"
          department="Sistema de gestión de proyectos"
          email="juan.perez@empresa.com"
          phone="+52 312 123-4567"
          location="Manzanillo, Colima"
          joinDate="Enero 2023"
          status="active"
        />
        <MemberCard 
          image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          name="Juan Pérez"
          position="Encargado de Servicio Social"
          department="Sistema de gestión de proyectos"
          email="juan.perez@empresa.com"
          phone="+52 312 123-4567"
          location="Manzanillo, Colima"
          joinDate="Enero 2023"
          status="active"
        />
      </div>
    </div>
  );
};

export default MembersList;
