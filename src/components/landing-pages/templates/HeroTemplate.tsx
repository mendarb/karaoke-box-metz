import { LandingPage } from "@/types/landing";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Star, Music, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroTemplateProps {
  page: LandingPage;
}

export const HeroTemplate = ({ page }: HeroTemplateProps) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/368fa776-0398-40e7-9d72-47b5ebb78ca9.png"
            alt="Karaoké ambiance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white space-y-8">
            <h1 className="text-6xl font-bold mb-6 animate-fadeIn">{page.title}</h1>
            <p className="text-2xl mb-8">{page.description}</p>
            <Link to="/booking">
              <Button 
                size="lg" 
                className="bg-violet-600 hover:bg-violet-700 text-white border-2 border-white"
              >
                Réserver maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="/lovable-uploads/71abef1d-375e-47bb-afb7-77d8435491e6.png"
                alt="Groupe karaoké"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">Une expérience unique</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Music className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Équipement Pro</h3>
                    <p className="text-gray-600">Son haute qualité et écrans HD pour une expérience optimale</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Box Privatifs</h3>
                    <p className="text-gray-600">Espaces insonorisés pour chanter en toute intimité</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ambiance Unique</h3>
                    <p className="text-gray-600">Une atmosphère chaleureuse et conviviale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Nos moments karaoké</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <img 
              src="/lovable-uploads/1d50de50-0e08-4925-906c-fa1b9888dccf.png"
              alt="Moment karaoké 1"
              className="rounded-lg shadow-lg hover:scale-105 transition-transform"
            />
            <img 
              src="/lovable-uploads/a04b0d99-a1db-45be-85bd-ad406a58497b.png"
              alt="Moment karaoké 2"
              className="rounded-lg shadow-lg hover:scale-105 transition-transform"
            />
            <img 
              src="/lovable-uploads/3b342a8e-f225-4a8a-b3ce-72a9d6614e39.png"
              alt="Moment karaoké 3"
              className="rounded-lg shadow-lg hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {page.content.sections.map((section: any, index: number) => (
            <div 
              key={index} 
              className="prose prose-lg max-w-none"
            >
              {section.title && (
                <h2 className="text-3xl font-bold mb-6 text-gray-900">{section.title}</h2>
              )}
              {section.content && (
                <div className="text-gray-600 leading-relaxed">{section.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/9edff13a-68e4-478f-857e-0f552b0ef61d.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-violet-900/90" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white space-y-8">
            <h2 className="text-4xl font-bold">
              Prêt à vivre l'expérience ?
            </h2>
            <p className="text-xl">
              Réservez votre box karaoké et créez des souvenirs inoubliables
            </p>
            <Link to="/booking">
              <Button 
                size="lg"
                className="bg-white text-violet-600 hover:bg-gray-100"
              >
                Réserver maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
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
    </div>
  );
};