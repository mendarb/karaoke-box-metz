import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface SettingsCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const SettingsCard = ({ title, description, children }: SettingsCardProps) => {
  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-1 mb-4">
        <h2 className="text-base font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </Card>
  );
};