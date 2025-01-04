import { LandingPage } from "@/types/landing";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { GallerySection } from "./components/GallerySection";
import { CTASection } from "./components/CTASection";
import { LandingFooter } from "./components/LandingFooter";

interface HeroTemplateProps {
  page: LandingPage;
}

export const HeroTemplate = ({ page }: HeroTemplateProps) => {
  return (
    <div className="min-h-screen">
      <HeroSection 
        title={page.title}
        description={page.description}
        imageUrl={page.image_url}
      />
      
      <FeaturesSection />
      
      <GallerySection />
      
      {page.content.sections.map((section: any, index: number) => (
        <div 
          key={index} 
          className="container mx-auto px-4 py-16"
        >
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="prose prose-lg max-w-none">
              {section.title && (
                <h2 className="text-3xl font-bold mb-6 text-gray-900">{section.title}</h2>
              )}
              {section.content && (
                <div className="text-gray-600 leading-relaxed">{section.content}</div>
              )}
            </div>
          </div>
        </div>
      ))}

      <CTASection />
      
      <LandingFooter />
    </div>
  );
};