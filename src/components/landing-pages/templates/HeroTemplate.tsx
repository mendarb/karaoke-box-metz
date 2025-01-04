import { LandingPage } from "@/types/landing";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Star } from "lucide-react";

interface HeroTemplateProps {
  page: LandingPage;
}

export const HeroTemplate = ({ page }: HeroTemplateProps) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-bold mb-6 animate-fadeIn">{page.title}</h1>
            <p className="text-xl text-gray-100 mb-8">{page.description}</p>
            <Button 
              size="lg" 
              className="bg-white text-violet-600 hover:bg-gray-100 group"
            >
              Réserver maintenant
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
              <Calendar className="mx-auto h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Réservation Facile</h3>
              <p>Réservez votre box en quelques clics</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
              <Star className="mx-auto h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Équipement Premium</h3>
              <p>Matériel professionnel et son haute qualité</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
              <Calendar className="mx-auto h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Box Privatifs</h3>
              <p>Espaces privés pour plus d'intimité</p>
            </div>
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
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Prêt à vivre une expérience unique ?
            </h2>
            <p className="text-gray-600 text-lg">
              Réservez votre box karaoké dès maintenant et créez des souvenirs inoubliables
            </p>
            <Button size="lg">
              Réserver maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};