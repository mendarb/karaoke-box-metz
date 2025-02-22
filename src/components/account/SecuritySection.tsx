import { Card } from "@/components/ui/card";
import { PasswordSection } from "./security/PasswordSection";
import { EmailSection } from "./security/EmailSection";

export const SecuritySection = () => {
  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-left">Sécurité du compte</h2>
      <div className="space-y-6">
        <PasswordSection />
        <EmailSection />
      </div>
    </Card>
  );
};