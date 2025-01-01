import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ErrorAlertProps {
  error: string;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          className="w-full mt-4"
          onClick={() => navigate("/")}
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};