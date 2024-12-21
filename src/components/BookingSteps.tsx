import { User, Calendar, Users, Check, MapPin } from "lucide-react";
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
        return <User className="w-5 h-5" />;
      case 2:
        return <MapPin className="w-5 h-5" />;
      case 3:
        return <Calendar className="w-5 h-5" />;
      case 4:
        return <Users className="w-5 h-5" />;
      case 5:
        return <Check className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className={`${isMobile ? 'fixed bottom-0 left-0 right-0 z-50 pb-4 pt-2 glass' : 'pb-8'}`}>
      <nav aria-label="Progress" className={`${isMobile ? 'px-4' : ''}`}>
        <ol role="list" className="flex items-center justify-between space-x-2">
          {steps.map((step) => (
            <li key={step.id} className="flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                    step.completed
                      ? "bg-violet-600 text-white"
                      : step.current
                      ? "border-2 border-violet-600 text-violet-600"
                      : "border-2 border-gray-300 text-gray-400"
                  }`}
                  title={`${step.name}: ${step.description}`}
                >
                  {step.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    getStepIcon(step.id)
                  )}
                </div>
                {!isMobile && (
                  <span className="mt-2 text-xs text-gray-500">
                    {step.name}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};