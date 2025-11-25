import projectImage from '@/assets/project2.webp'

export default function ProjectImage({ src, alt }) {
  return (
    <div className="w-full rounded-xl overflow-hidden mb-4 sm:mb-5 shadow-md mt-4 sm:mt-5 border border-gray-200 dark:border-slate-700">
      <img
        src={src || projectImage}
        alt={alt || 'Imagen del proyecto'}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Si la imagen del backend falla, usar la imagen por defecto
          e.target.src = projectImage;
        }}
      />
    </div>
  );
}