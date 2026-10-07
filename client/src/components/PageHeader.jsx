function PageHeader({
  title,
  description,
  actionText,
  onAction,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 wrap-break-word">
            {title}
          </h1>

          {description && (
            <p className="text-gray-500 mt-2">
              {description}
            </p>
          )}
        </div>

        {actionText && onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition whitespace-nowrap"
          >
            {actionText}
          </button>
        )}

      </div>

    </div>
  );
}

export default PageHeader;