import { User2, Calendar, Users, CreditCard } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export interface Step {
  id?: number;
  title: string;
  description?: string;
  icon: React.ReactNode;
  completed?: boolean;
  current?: boolean;
}

interface BookingStepsProps {
  steps: Step[];
  currentStep: number;
}

export const BookingSteps = ({ steps, currentStep }: BookingStepsProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center relative">
        {/* Progress bar */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-gray-200 w-full -z-10"
          aria-hidden="true"
        >
          <div 
            className="h-full bg-violet-600 transition-all duration-500"
            style={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>

        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col items-center space-y-3 w-full max-w-[150px]",
              step.current ? "opacity-100" : "opacity-50"
            )}
          >
            <div
              className={cn(
                "rounded-full p-3 transition-all duration-300 transform",
                step.completed ? "bg-violet-600 text-white scale-110" : 
                step.current ? "bg-violet-100 text-violet-600 ring-2 ring-violet-600 scale-110" : 
                "bg-gray-100 text-gray-400"
              )}
            >
              {step.icon}
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-sm font-medium text-center">
                {step.title}
              </span>
              {step.description && (
                <span className="text-xs text-gray-500 text-center hidden lg:block max-w-[120px]">
                  {step.description}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};