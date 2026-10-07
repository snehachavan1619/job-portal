function EmptyState({
  icon = "📭",
  title = "No Data Found",
  message = "There is nothing to display here.",
  actionText,
  onAction,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">

      <div className="text-5xl mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-gray-800">
        {title}
      </h3>

      <p className="text-gray-500 mt-2 max-w-md mx-auto">
        {message}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {actionText}
        </button>
      )}

    </div>
  );
}

export default EmptyState;