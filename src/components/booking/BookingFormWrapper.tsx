import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingFormWrapperProps {
  children: ReactNode;
}

export const BookingFormWrapper = ({ children }: BookingFormWrapperProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`bg-white/70 backdrop-blur-sm shadow-2xl rounded-3xl ${
      isMobile ? 'p-4' : 'p-6 sm:p-8'
    } border border-violet-100/50`}>
      {children}
    </div>
  );
};