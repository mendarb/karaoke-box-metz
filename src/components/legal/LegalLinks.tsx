import { Link } from "react-router-dom";

export const LegalLinks = () => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2">
        <Link 
          to="/legal/terms" 
          className="text-gray-600 hover:text-violet-600 transition-colors"
        >
          Conditions générales
        </Link>
        <Link 
          to="/legal/privacy" 
          className="text-gray-600 hover:text-violet-600 transition-colors"
        >
          Politique de confidentialité
        </Link>
        <Link 
          to="/legal/cancellation" 
          className="text-gray-600 hover:text-violet-600 transition-colors"
        >
          Politique d'annulation
        </Link>
      </div>
    </div>
  );
};