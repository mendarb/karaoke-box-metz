import { LandingPage } from "@/types/landing";
import { BasicTemplate } from "./templates/BasicTemplate";
import { HeroTemplate } from "./templates/HeroTemplate";
import { Helmet } from "react-helmet";

interface LandingPageRendererProps {
  page: LandingPage;
}

export const LandingPageRenderer = ({ page }: LandingPageRendererProps) => {
  const templates = {
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
      </Helmet>
      <Template page={page} />
    </>
  );
};