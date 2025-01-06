import { User2, Calendar, Users, CreditCard } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Step {
  id?: number;
  title: string;
  description?: string;
  icon: React.ReactNode;
  completed?: boolean;
  current?: boolean;
  tooltip?: string;
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
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex flex-col items-center w-full ${
                    index !== steps.length - 1 ? "border-r border-gray-200" : ""
                  } ${step.current ? "opacity-100" : "opacity-50"}`}
                >
                  <div
                    className={`rounded-full p-3 mb-2 ${
                      step.current
                        ? "bg-violet-100 text-violet-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {step.title}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{step.tooltip || step.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};