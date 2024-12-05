import { Check, ChevronRight, User, Calendar, Users, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export type BookingStep = {
  id: number;
  name: string;
  description: string;
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
        <ol role="list" className={`${isMobile ? 'flex justify-around' : 'md:flex md:space-x-8'}`}>
          {steps.map((step, index) => (
            <li key={step.id} className={`${isMobile ? 'flex-1' : 'md:flex-1'}`}>
              <div
                className={`group flex flex-col items-center transition-all duration-300 ${
                  isMobile ? '' : 'md:border-t-4 md:pt-4'
                } ${
                  step.current
                    ? "border-violet-600"
                    : step.completed
                    ? "border-violet-600/70"
                    : "border-gray-200/70"
                }`}
              >
                <span className={`flex items-center justify-center ${isMobile ? 'flex-col' : ''}`}>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      step.completed
                        ? "bg-violet-600 text-white"
                        : step.current
                        ? "border-2 border-violet-600 text-violet-600"
                        : "border-2 border-gray-300 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      getStepIcon(step.id)
                    )}
                  </span>
                  {!isMobile && (
                    <>
                      <span className="ml-4 text-sm font-medium">
                        {step.name}
                      </span>
                      {index < steps.length - 1 && !step.current && (
                        <ChevronRight className="ml-2 h-5 w-5 text-gray-300" />
                      )}
                    </>
                  )}
                </span>
                {isMobile ? (
                  <span className="mt-1 text-xs text-gray-500">{step.name}</span>
                ) : (
                  <span className="text-sm text-gray-500">{step.description}</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};