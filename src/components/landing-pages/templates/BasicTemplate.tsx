import { LandingPage } from "@/types/landing";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Star, Music, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface BasicTemplateProps {
  page: LandingPage;
}

export const BasicTemplate = ({ page }: BasicTemplateProps) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-bold mb-6 animate-fadeIn">{page.title}</h1>
            <p className="text-xl text-gray-100 mb-8">{page.description}</p>
            <Link to="/booking">
              <Button 
                size="lg" 
                className="bg-white text-violet-600 hover:bg-gray-100 group"
              >
                Réserver maintenant
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Équipement Pro</h3>
              <p className="text-gray-600">Matériel professionnel et son haute qualité pour une expérience optimale</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Box Privatifs</h3>
              <p className="text-gray-600">Espaces privés et insonorisés pour chanter en toute intimité</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Ambiance Unique</h3>
              <p className="text-gray-600">Une atmosphère chaleureuse et conviviale pour des moments inoubliables</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Grid Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Vivez l'expérience Karaoké</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <img 
              src="/lovable-uploads/1f2489a0-f421-4462-b3ca-6f5701646644.png"
              alt="Karaoké expérience" 
              className="rounded-lg shadow-lg hover:scale-105 transition-transform"
            />
            <img 
              src="/lovable-uploads/9edff13a-68e4-478f-857e-0f552b0ef61d.png"
              alt="Groupe karaoké" 
              className="rounded-lg shadow-lg hover:scale-105 transition-transform"
            />
            <img 
              src="/lovable-uploads/3b342a8e-f225-4a8a-b3ce-72a9d6614e39.png"
              alt="Ambiance karaoké" 
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
      <div className="bg-violet-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">
              Prêt à vivre une expérience unique ?
            </h2>
            <p className="text-lg text-violet-100">
              Réservez votre box karaoké dès maintenant et créez des souvenirs inoubliables
            </p>
            <Link to="/booking">
              <Button 
                size="lg"
                variant="secondary"
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