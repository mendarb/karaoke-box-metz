import { User, Calendar, Users, Check } from "lucide-react";
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
        return <Calendar className="w-5 h-5" />;
      case 3:
        return <Users className="w-5 h-5" />;
      case 4:
        return <Check className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="pb-4">
      <nav aria-label="Progress">
        <ol role="list" className="flex justify-between space-x-2">
          {steps.map((step) => (
            <li key={step.id} className="flex-1">
              <div
                className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
                  step.current
                    ? "bg-violet-600 text-white"
                    : step.completed
                    ? "bg-violet-100 text-violet-600"
                    : "bg-gray-100 text-gray-400"
                }`}
                title={`${step.name}: ${step.description}`}
              >
                {getStepIcon(step.id)}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};