import { Navigate } from "react-router-dom";
import { useUserState } from "@/hooks/useUserState";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({
  children,
  adminOnly = false,
}: ProtectedRouteProps) => {
  const { isLoading: isUserLoading, sessionChecked, user } = useUserState();
  const { data: isAdmin, isLoading: isLoadingAdmin } = useIsAdmin();
  const { toast } = useToast();

  // Attendre que la session soit vérifiée
  if (!sessionChecked || isUserLoading || (adminOnly && isLoadingAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Rediriger vers la page d'accueil si non connecté
  if (!user) {
    toast({
      title: "Accès refusé",
      description: "Vous devez être connecté pour accéder à cette page",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  // Vérifier les droits admin si nécessaire
  if (adminOnly && !isAdmin) {
    toast({
      title: "Accès refusé",
      description: "Vous n'avez pas les droits d'accès à cette page",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};