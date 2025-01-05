import { LandingPage } from "@/types/landing";
import { BasicTemplate } from "./templates/BasicTemplate";
import { HeroTemplate } from "./templates/HeroTemplate";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

interface LandingPageRendererProps {
  page: LandingPage;
}

export const LandingPageRenderer = ({ page }: LandingPageRendererProps) => {
  console.log("Rendering landing page with template:", page.template_type);

  useEffect(() => {
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  }, [page.slug]);

  const templates: Record<string, React.ComponentType<{ page: LandingPage }>> = {
    basic: BasicTemplate,
    hero: HeroTemplate,
  };

  const Template = templates[page.template_type];

  if (!Template) {
    console.error(`Template type ${page.template_type} not found`);
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{page.meta_title}</title>
        <meta name="description" content={page.meta_description} />
        <meta name="keywords" content={page.keywords.join(", ")} />
        {page.image_url && <meta property="og:image" content={page.image_url} />}
        <meta property="og:title" content={page.meta_title} />
        <meta property="og:description" content={page.meta_description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Template page={page} />
    </>
  );
};