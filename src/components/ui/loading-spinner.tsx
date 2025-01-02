import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ className, fullScreen = false }: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/80 p-6 rounded-lg shadow-lg flex flex-col items-center gap-3">
          <div
            className={cn(
              "inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
              className
            )}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-sm text-muted-foreground">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={cn(
          "inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
          className
        )}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};