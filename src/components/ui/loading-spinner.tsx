export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
    </div>
  );
};