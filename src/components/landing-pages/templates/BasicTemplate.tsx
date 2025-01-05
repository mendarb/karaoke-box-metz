import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { CTASection } from "./components/CTASection";
import { GallerySection } from "./components/GallerySection";
import { LandingFooter } from "./components/LandingFooter";
import { Helmet } from "react-helmet";
import { Facebook, Instagram, Twitter, Music, Star, Users } from "lucide-react";
import { LandingPage } from "@/types/landing";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BasicTemplateProps {
  page: LandingPage;
}

export const BasicTemplate = ({ page }: BasicTemplateProps) => {
  const defaultFeatures = [
    {
      title: "Box Privatives",
      description: "Profitez d'un espace privatif entièrement équipé pour votre groupe",
      icon: <Music className="w-8 h-8" />
    },
    {
      title: "Ambiance Premium",
      description: "Une atmosphère unique avec un système son et lumières haut de gamme",
      icon: <Star className="w-8 h-8" />
    },
    {
      title: "Entre Amis",
      description: "Le lieu idéal pour des moments inoubliables entre amis",
      icon: <Users className="w-8 h-8" />
    }
  ];

  const features = page.content.features?.length > 0 ? page.content.features : defaultFeatures;
  const gallery = page.content.gallery || [];

  return (
    <>
      <Helmet>
        <title>{page.meta_title}</title>
        <meta name="description" content={page.meta_description} />
        <meta name="keywords" content={page.keywords.join(', ')} />
        <meta property="og:title" content={page.meta_title} />
        <meta property="og:description" content={page.meta_description} />
        {page.image_url && <meta property="og:image" content={page.image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.meta_title} />
        <meta name="twitter:description" content={page.meta_description} />
        {page.image_url && <meta name="twitter:image" content={page.image_url} />}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-white to-kbox-pink/10">
        <HeroSection
          title={page.title}
          subtitle={page.description}
          imageUrl={page.image_url}
        />

        <div className="container mx-auto px-4 py-8">
          <Button 
            asChild
            variant="outline"
            className="w-full md:w-auto bg-white hover:bg-gray-50 text-gray-900 border-gray-200 mb-8"
          >
            <Link to="/box-3d">
              Voir le rendu 3D de notre box
            </Link>
          </Button>
        </div>

        <FeaturesSection
          title="Nos points forts"
          subtitle="Découvrez ce qui rend KBOX unique"
          features={features}
        />

        <GallerySection
          title="Notre univers"
          subtitle="Plongez dans l'ambiance de nos box"
          images={gallery}
        />

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
          title="Prêt à vivre l'expérience KBOX ?"
          description="Réservez votre box maintenant et créez des souvenirs inoubliables"
        />
        
        <LandingFooter />
      </main>
    </>
  );
};