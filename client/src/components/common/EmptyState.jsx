export default function EmptyState({
  title = "No Data Found",
  description = "",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-xl font-semibold">{title}</h2>

      {description && (
        <p className="mt-2 text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
}