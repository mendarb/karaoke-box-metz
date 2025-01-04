import { LandingPage } from "@/types/landing";
import { Button } from "@/components/ui/button";

interface HeroTemplateProps {
  page: LandingPage;
}

export const HeroTemplate = ({ page }: HeroTemplateProps) => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{page.title}</h1>
            <p className="text-xl text-gray-600 mb-8">{page.description}</p>
            <Button size="lg">Réserver maintenant</Button>
          </div>
        </div>
        
        <div className="prose max-w-none">
          {page.content.sections.map((section: any, index: number) => (
            <div key={index} className="mb-12">
              {section.title && (
                <h2 className="text-3xl font-semibold mb-6">{section.title}</h2>
              )}
              {section.content && (
                <div className="text-gray-600">{section.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};