import React from 'react';
import FavoriteProjectsList from '../components/FavoriteProjectsList';

const FavoriteProjects = () => {
  return (
    <section className="flex flex-col items-center w-full min-h-screen px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 dark:text-gray-100">
        Mis <span className="text-lime-600 dark:text-lime-500">favoritos</span>
      </h1>

      <FavoriteProjectsList />
    </section>
  );
};

export default FavoriteProjects;
