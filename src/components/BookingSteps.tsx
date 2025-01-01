import { Check, ChevronRight, User, Calendar, Users, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export type BookingStep = {
  id: number;
  name: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  current: boolean;
};

export const BookingSteps = ({
  steps,
  currentStep,
}: {
  steps: BookingStep[];
  currentStep: number;
}) => {
  const isMobile = useIsMobile();

  const getStepIcon = (stepId: number) => {
    switch (stepId) {
      case 1:
        return <User className="h-5 w-5" />;
      case 2:
        return <Calendar className="h-5 w-5" />;
      case 3:
        return <Users className="h-5 w-5" />;
      case 4:
        return <Settings className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className={`${isMobile ? 'fixed bottom-0 left-0 right-0 z-50 pb-4 pt-2 glass' : 'pb-8'}`}>
      <nav aria-label="Progress" className={`${isMobile ? 'px-4' : ''}`}>
        <ol role="list" className="flex justify-around space-x-2 md:space-x-4">
          {steps.map((step) => (
            <li key={step.id} className="flex-1">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                    step.completed
                      ? "bg-violet-600 text-white"
                      : step.current
                      ? "border-2 border-violet-600 text-violet-600"
                      : "border-2 border-gray-300 text-gray-400"
                  }`}
                  title={step.name}
                >
                  {step.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};