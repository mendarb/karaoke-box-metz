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
      {/* Hero Section avec overlay gradient */}
      <div className="relative bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8 relative">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn leading-tight">
              {page.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed max-w-2xl mx-auto">
              {page.description}
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/booking">
                <Button 
                  size="lg" 
                  className="bg-white text-violet-600 hover:bg-gray-100 group shadow-lg hover:shadow-xl transition-all"
                >
                  Réserver maintenant
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="#features">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                >
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid avec design amélioré */}
      <div id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Une expérience unique à {page.title.split(' ')[0]}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Équipement Pro</h3>
              <p className="text-gray-600">Matériel professionnel et son haute qualité pour une expérience optimale</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Box Privatifs</h3>
              <p className="text-gray-600">Espaces privés et insonorisés pour chanter en toute intimité</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Ambiance Unique</h3>
              <p className="text-gray-600">Une atmosphère chaleureuse et conviviale pour des moments inoubliables</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Grid Section avec design amélioré */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Découvrez notre karaoké
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]">
              <img 
                src="/lovable-uploads/1f2489a0-f421-4462-b3ca-6f5701646644.png"
                alt="Karaoké expérience" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">Box Premium</h3>
                  <p className="text-sm">Une expérience VIP</p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]">
              <img 
                src="/lovable-uploads/9edff13a-68e4-478f-857e-0f552b0ef61d.png"
                alt="Groupe karaoké" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">Ambiance Groupe</h3>
                  <p className="text-sm">Parfait pour vos soirées</p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]">
              <img 
                src="/lovable-uploads/3b342a8e-f225-4a8a-b3ce-72a9d6614e39.png"
                alt="Ambiance karaoké" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">Équipement Pro</h3>
                  <p className="text-sm">Son et image haute qualité</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections avec style amélioré */}
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

      {/* CTA Section avec design amélioré */}
      <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8 relative">
            <h2 className="text-3xl md:text-4xl font-bold">
              Prêt à vivre une expérience unique ?
            </h2>
            <p className="text-xl text-violet-100">
              Réservez votre box karaoké dès maintenant et créez des souvenirs inoubliables
            </p>
            <Link to="/booking">
              <Button 
                size="lg"
                className="bg-white text-violet-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
              >
                Réserver maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer avec design amélioré */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">📍</span> Metz Centre
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">📞</span> 06 12 34 56 78
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✉️</span> contact@karaoke-metz.fr
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Horaires</h3>
              <ul className="space-y-3">
                <li>Lundi - Jeudi: 14h - 23h</li>
                <li>Vendredi - Samedi: 14h - 00h</li>
                <li>Dimanche: 14h - 22h</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Liens utiles</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/legal/terms" className="hover:text-white transition-colors">
                    Conditions générales
                  </Link>
                </li>
                <li>
                  <Link to="/legal/privacy" className="hover:text-white transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/legal/cancellation" className="hover:text-white transition-colors">
                    Conditions d'annulation
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Karaoké Metz. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};