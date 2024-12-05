import { Check, ChevronRight } from "lucide-react";
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

  return (
    <div className="space-y-4 pb-6 sm:pb-8">
      <nav aria-label="Progress">
        <ol role="list" className={`${isMobile ? 'space-y-4' : 'md:flex md:space-x-8 md:space-y-0'}`}>
          {steps.map((step, index) => (
            <li key={step.id} className={`${isMobile ? 'flex-1' : 'md:flex-1'}`}>
              <div
                className={`group flex flex-col border-l-4 py-2 pl-4 transition-all duration-200 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                  step.current
                    ? "border-violet-600 cursor-default"
                    : step.completed
                    ? "border-violet-600 cursor-pointer hover:border-violet-700"
                    : "border-gray-200 cursor-not-allowed"
                }`}
              >
                <span className="text-sm font-medium flex items-center">
                  {step.completed ? (
                    <span className="flex items-center text-violet-600 group-hover:text-violet-700">
                      <Check className="mr-2 h-5 w-5" />
                      {step.name}
                    </span>
                  ) : step.current ? (
                    <span className="text-violet-600 flex items-center">
                      {step.name}
                      <ChevronRight className="ml-2 h-5 w-5 animate-pulse" />
                    </span>
                  ) : (
                    <span className="text-gray-500">{step.name}</span>
                  )}
                  {!isMobile && index < steps.length - 1 && !step.current && (
                    <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                  )}
                </span>
                <span className="text-sm text-gray-500">{step.description}</span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};