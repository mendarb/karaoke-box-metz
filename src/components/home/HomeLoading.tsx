import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const HomeLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
};