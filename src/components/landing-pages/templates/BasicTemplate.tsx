import { LandingPage } from "@/types/landing";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

interface BasicTemplateProps {
  page: LandingPage;
}

export const BasicTemplate = ({ page }: BasicTemplateProps) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{page.title}</h1>
            <p className="text-xl text-gray-600 mb-8">{page.description}</p>
            <Button size="lg">
              Réserver maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {page.content.sections.map((section: any, index: number) => (
            <div 
              key={index}
              className="mb-16 last:mb-0"
            >
              {section.title && (
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
              )}
              {section.content && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Calendar className="h-8 w-8 text-violet-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Réservation Simple</h3>
                <p className="text-gray-600">
                  Réservez votre créneau en quelques clics via notre système de réservation en ligne
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Calendar className="h-8 w-8 text-violet-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Box Privatifs</h3>
                <p className="text-gray-600">
                  Profitez d'un espace privé pour chanter en toute intimité
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-violet-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Prêt à réserver votre session ?
            </h2>
            <p className="text-xl mb-8">
              Choisissez votre créneau et vivez une expérience unique
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-violet-600 hover:bg-gray-100"
            >
              Réserver maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};