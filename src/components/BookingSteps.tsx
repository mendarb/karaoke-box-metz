import { User2, Calendar, Users, CreditCard } from "lucide-react";
import React from "react";

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
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center w-full ${
              index !== steps.length - 1 ? "border-r border-gray-200" : ""
            }`}
          >
            <div
              className={`rounded-full p-3 mb-2 transition-all duration-300 transform ${
                step.current
                  ? "bg-violet-100 text-violet-600 scale-110 shadow-lg"
                  : step.completed
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step.icon}
            </div>
            <span className={`text-sm font-medium hidden sm:block transition-colors duration-300 ${
              step.current ? "text-violet-600" : "text-gray-500"
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};