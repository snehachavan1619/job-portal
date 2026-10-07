function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>

      <p className="mt-4 text-gray-500 font-medium">
        {text}
      </p>
    </div>
  );
}

export default LoadingSpinner;