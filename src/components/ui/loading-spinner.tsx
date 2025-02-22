import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({ className, fullScreen, size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div
      className={cn(
        fullScreen && "fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm",
        !fullScreen && "inline-block"
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
          sizeClasses[size],
          className
        )}
        role="status"
      >
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  );
};