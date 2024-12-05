import { Check } from "lucide-react";

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
  return (
    <div className="space-y-4 pb-8">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step) => (
            <li key={step.id} className="md:flex-1">
              <div
                className={`group relative flex flex-col border-l-4 py-2 pl-4 hover:bg-gray-50 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                  step.current
                    ? "border-violet-600 cursor-default"
                    : step.completed
                    ? "border-violet-600 cursor-pointer"
                    : "border-gray-200 cursor-not-allowed"
                }`}
              >
                <span className="text-sm font-medium">
                  {step.completed ? (
                    <span className="flex items-center text-violet-600">
                      <Check className="mr-2 h-4 w-4" />
                      {step.name}
                    </span>
                  ) : step.current ? (
                    <span className="text-violet-600">{step.name}</span>
                  ) : (
                    <span className="text-gray-500">{step.name}</span>
                  )}
                </span>
                <span className="text-sm text-gray-500">{step.description}</span>
                {step.current && (
                  <div className="absolute -bottom-px left-0 h-0.5 w-full bg-violet-600" />
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};