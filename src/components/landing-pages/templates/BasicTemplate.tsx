import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { CTASection } from "./components/CTASection";
import { GallerySection } from "./components/GallerySection";
import { LandingFooter } from "./components/LandingFooter";
import { Helmet } from "react-helmet";
import { Facebook, Instagram, Twitter } from "lucide-react";

interface BasicTemplateProps {
  content: {
    title: string;
    description: string;
    heroImage?: string;
    features?: Array<{
      title: string;
      description: string;
    }>;
    gallery?: Array<{
      url: string;
      alt: string;
    }>;
  };
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const BasicTemplate = ({ content, meta }: BasicTemplateProps) => {
  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords.join(', ')} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        {content.heroImage && <meta property="og:image" content={content.heroImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {content.heroImage && <meta name="twitter:image" content={content.heroImage} />}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <main className="min-h-screen">
        <HeroSection
          title={content.title}
          subtitle={content.description}
          imageUrl={content.heroImage}
        />

        {content.features && (
          <FeaturesSection
            title="Nos points forts"
            subtitle="Découvrez ce qui rend notre escape game unique"
            features={content.features}
          />
        )}

        {content.gallery && (
          <GallerySection
            title="Notre univers"
            subtitle="Plongez dans l'ambiance de nos salles"
            images={content.gallery}
          />
        )}

        <CTASection
          title="Prêt à relever le défi ?"
          description="Réservez votre session maintenant et vivez une expérience inoubliable"
        />

        <LandingFooter
          links={[
            { text: "Accueil", url: "/" },
            { text: "Réservation", url: "/booking" },
            { text: "Contact", url: "/contact" }
          ]}
          socialLinks={[
            { icon: <Facebook className="h-6 w-6" />, url: "#" },
            { icon: <Instagram className="h-6 w-6" />, url: "#" },
            { icon: <Twitter className="h-6 w-6" />, url: "#" }
          ]}
        />
      </main>
    </>
  );
};