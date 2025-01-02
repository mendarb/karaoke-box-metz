import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "@/hooks/useUserState";
import { Navbar } from "@/components/navigation/Navbar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50">
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      <main className="container mx-auto px-4 py-8">
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