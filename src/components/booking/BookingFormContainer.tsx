import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingFormContainerProps {
  children: ReactNode;
}

export const BookingFormContainer = ({ children }: BookingFormContainerProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {children}
      </div>
    </div>
  );
};