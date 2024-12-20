import { Link } from "react-router-dom";

export const LegalLinks = () => {
  return (
    <div className="text-sm text-gray-500 space-x-4">
      <Link to="/legal/terms" className="hover:text-violet-600 transition-colors">
        Conditions générales
      </Link>
      <Link to="/legal/privacy" className="hover:text-violet-600 transition-colors">
        Politique de confidentialité
      </Link>
      <Link to="/legal/cancellation" className="hover:text-violet-600 transition-colors">
        Politique d'annulation
      </Link>
    </div>
  );
};