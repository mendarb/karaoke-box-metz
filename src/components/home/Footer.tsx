import { LegalLinks } from "@/components/legal/LegalLinks";
import { Instagram, Facebook } from "lucide-react";

interface BusinessHours {
  [key: string]: string;
}

const Footer = () => {
  const businessHours: BusinessHours = {
    lundi: 'Fermé',
    mardi: 'Fermé',
    mercredi: '17h - 23h',
    jeudi: '17h - 23h',
    vendredi: '17h - 23h',
    samedi: '17h - 23h',
    dimanche: '17h - 23h'
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="md:container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8 py-12">
          <div>
            <h3 className="text-sm font-semibold mb-4 text-kbox-coral">Informations légales</h3>
            <LegalLinks />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4 text-kbox-coral">Contact</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Email: <a href="mailto:contact@karaoke-box-metz.fr" className="hover:text-kbox-coral">contact@karaoke-box-metz.fr</a></p>
              <p>Tél: <a href="tel:+33782492402" className="hover:text-kbox-coral">07 82 49 24 02</a></p>
              <p>Adresse: 12 Rue des Huiliers, 57000 Metz</p>
              <div className="flex space-x-4 mt-4">
                <a 
                  href="https://www.instagram.com/karaokeboxmetz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-kbox-coral"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.facebook.com/people/Karaoké-BOX-Metz/61571072424332/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-kbox-coral"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4 text-kbox-coral">Horaires</h3>
            <div className="grid grid-cols-1 gap-1">
              {Object.entries(businessHours).map(([day, hours]) => (
                <div key={day} className="text-sm text-gray-600">
                  <span className="capitalize">{day}:</span>{' '}
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 px-4 md:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} K.Box - Karaoké Privatif. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;