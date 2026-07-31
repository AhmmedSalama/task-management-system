export default function AuthHeader({
  title,
  subtitle,
}) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold">
        {title}
      </h1>

      <p className="text-gray-500 mt-2">
        {subtitle}
      </p>
    </div>
  );
}