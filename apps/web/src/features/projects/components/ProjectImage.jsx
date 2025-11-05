import projectImage from '@/assets/project2.webp'

export default function ProjectImage({ src, alt }) {
  return (
    <div className="w-9/12 h-auto rounded-xl overflow-hidden mb-5 shadow-md mt-5">
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