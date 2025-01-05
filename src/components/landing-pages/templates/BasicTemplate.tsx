import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { CTASection } from "./components/CTASection";
import { GallerySection } from "./components/GallerySection";
import { LandingFooter } from "./components/LandingFooter";
import { Helmet } from "react-helmet";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { LandingPage } from "@/types/landing";

interface BasicTemplateProps {
  page: LandingPage;
}

export const BasicTemplate = ({ page }: BasicTemplateProps) => {
  const features = page.content.features || [];
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

      <main className="min-h-screen">
        <HeroSection
          title={page.title}
          subtitle={page.description}
          imageUrl={page.image_url}
        />

        {features.length > 0 && (
          <FeaturesSection
            title="Nos points forts"
            subtitle="Découvrez ce qui rend notre escape game unique"
            features={features}
          />
        )}

        {gallery.length > 0 && (
          <GallerySection
            title="Notre univers"
            subtitle="Plongez dans l'ambiance de nos salles"
            images={gallery}
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