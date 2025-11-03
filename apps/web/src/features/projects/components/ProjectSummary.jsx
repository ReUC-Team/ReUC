export default function ProjectSummary({ title, description }) {
  return (
    <div className="mb-12 w-9/12">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
}