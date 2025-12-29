export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex items-center justify-center">
      <div className="text-center">
        {/* Animated loader */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Loading text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Loading...
        </h2>
        <p className="text-gray-600">
          Please wait while we fetch the latest lounge information
        </p>
      </div>
    </div>
  );
}
