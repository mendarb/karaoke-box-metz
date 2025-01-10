import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "@/hooks/useUserState";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthModal } from "@/components/auth/AuthModal";
import { useState } from "react";

export const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUserState();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/50 via-white to-violet-50/50">
      <main className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};