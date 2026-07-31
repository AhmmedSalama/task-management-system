export default function ErrorState({
  message = "Something went wrong",
}) {
  return (
    <div className="flex justify-center py-16">
      <p className="text-red-500 font-medium">
        {message}
      </p>
    </div>
  );
}