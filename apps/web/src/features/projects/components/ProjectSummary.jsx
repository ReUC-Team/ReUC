export default function ProjectSummary({ title, description }) {
  return (
    <div className="mb-8 sm:mb-12 w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 dark:text-gray-100">{title}</h2>
      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
}