export default function ProjectInfoCard({ items = [] }) {
    return (
      <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-md mb-6 w-full border border-gray-200 dark:border-slate-700">
        <ul className="space-y-2 text-sm sm:text-base dark:text-gray-200">
          {items.map(({ label, value }, idx) => (
            <li key={idx}>
              <strong className="dark:text-gray-100">{label}:</strong> <span className="dark:text-gray-300">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  