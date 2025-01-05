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
  const features = page.content.features || [];
  const gallery = page.content.gallery || [];

  return (
    <div className="min-h-screen">
      <HeroSection 
        title={page.title}
        subtitle={page.description}
        imageUrl={page.image_url}
      />
      
      {features.length > 0 && (
        <FeaturesSection
          title="Nos points forts"
          subtitle="Découvrez ce qui nous rend uniques"
          features={features}
        />
      )}
      
      {gallery.length > 0 && (
        <GallerySection
          title="Notre univers"
          subtitle="Plongez dans notre univers"
          images={gallery}
        />
      )}
      
      {page.content.sections?.map((section: any, index: number) => (
        <div 
          key={index} 
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                {section.title && (
                  <h2 className="text-3xl font-bold mb-8 text-gray-900">{section.title}</h2>
                )}
                {section.content && (
                  <div className="text-gray-600 leading-relaxed">{section.content}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <CTASection 
        title="Prêt à tenter l'aventure ?"
        description="Réservez votre session maintenant et vivez une expérience inoubliable"
      />
      
      <LandingFooter />
    </div>
  );
};