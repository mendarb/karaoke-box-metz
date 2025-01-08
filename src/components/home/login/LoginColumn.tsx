import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/AuthForm";

interface LoginColumnProps {
  user: User | null;
  onClose: () => void;
}

export const LoginColumn = ({ user, onClose }: LoginColumnProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-none">
            <div className="space-y-2 p-6 pb-0">
              <h1 className="text-2xl font-semibold text-gray-900">
                Connectez-vous
              </h1>
              <p className="text-base text-gray-500">
                Pas encore de compte ? Créez-en un en quelques clics.
              </p>
            </div>
            {!user ? (
              <AuthForm 
                onClose={onClose} 
                isLogin={true}
                onToggleMode={() => {}}
              />
            ) : (
              <BookingForm />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};