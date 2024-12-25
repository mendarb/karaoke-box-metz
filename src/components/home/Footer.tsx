import { LegalLinks } from "@/components/legal/LegalLinks";

interface BusinessHours {
  [key: string]: string;
}

export const Footer = () => {
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
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold mb-4 text-kbox-coral">Informations légales</h3>
            <LegalLinks />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4 text-kbox-coral">Contact</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Email: contact@karaoke-box-metz.fr</p>
              <p>Tél: 07 82 49 24 02</p>
              <p>Adresse: 12 Rue des Huiliers, 57000 Metz</p>
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
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} K.Box - Karaoké Privatif. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};