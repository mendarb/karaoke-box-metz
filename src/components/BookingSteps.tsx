import { User2, Calendar, Users, CreditCard } from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface BookingStepsProps {
  steps: Step[];
  currentStep: number;
}

export const BookingSteps = ({ steps, currentStep }: BookingStepsProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between">
        {[
          { icon: <User2 className="w-6 h-6" />, title: "Coordonnées" },
          { icon: <Calendar className="w-6 h-6" />, title: "Date & Heure" },
          { icon: <Users className="w-6 h-6" />, title: "Groupe" },
          { icon: <CreditCard className="w-6 h-6" />, title: "Paiement" },
        ].map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center w-full ${
              index !== 3 ? "border-r border-gray-200" : ""
            } ${index === currentStep - 1 ? "opacity-100" : "opacity-50"}`}
          >
            <div
              className={`rounded-full p-3 mb-2 ${
                index === currentStep - 1
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
        ))}
      </div>
    </div>
  );
};