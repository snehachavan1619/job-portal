function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">

      <div className="text-4xl">
        ⚠️
      </div>

      <h3 className="text-lg font-bold text-red-700 mt-3">
        Something went wrong
      </h3>

      <p className="text-red-600 mt-2">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition"
        >
          Try Again
        </button>
      )}

    </div>
  );
}

export default ErrorMessage;