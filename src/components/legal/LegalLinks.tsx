import { Link } from "react-router-dom";

export const LegalLinks = () => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-3">
        <Link 
          to="/legal/terms" 
          className="text-gray-600 hover:text-violet-600 transition-colors flex items-center gap-2"
        >
          Conditions générales
        </Link>
        <Link 
          to="/legal/privacy" 
          className="text-gray-600 hover:text-violet-600 transition-colors flex items-center gap-2"
        >
          Politique de confidentialité
        </Link>
        <Link 
          to="/legal/cancellation" 
          className="text-gray-600 hover:text-violet-600 transition-colors flex items-center gap-2"
        >
          Politique d'annulation
        </Link>
      </div>
    </div>
  );
};