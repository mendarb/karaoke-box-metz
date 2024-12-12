import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "@/hooks/useUserState";
import { Navbar } from "@/components/navigation/Navbar";

export const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUserState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};