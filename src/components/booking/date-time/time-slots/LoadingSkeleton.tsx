export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div 
          key={index}
          className="h-10 bg-gray-100 animate-pulse rounded-md"
        />
      ))}
    </div>
  );
};