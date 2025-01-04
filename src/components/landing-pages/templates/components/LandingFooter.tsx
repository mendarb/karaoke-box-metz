import { Link } from "react-router-dom";

export const LandingFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>📍 Metz Centre</li>
              <li>📞 06 12 34 56 78</li>
              <li>✉️ contact@karaoke-metz.fr</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Horaires</h3>
            <ul className="space-y-2">
              <li>Lundi - Jeudi: 14h - 23h</li>
              <li>Vendredi - Samedi: 14h - 00h</li>
              <li>Dimanche: 14h - 22h</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li><Link to="/legal/terms" className="hover:text-white">Conditions générales</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-white">Politique de confidentialité</Link></li>
              <li><Link to="/legal/cancellation" className="hover:text-white">Conditions d'annulation</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Karaoké Metz. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};