import { LandingPage } from "@/types/landing";

interface BasicTemplateProps {
  page: LandingPage;
}

export const BasicTemplate = ({ page }: BasicTemplateProps) => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
        <div className="prose max-w-none">
          {page.content.sections.map((section: any, index: number) => (
            <div key={index} className="mb-8">
              {section.title && (
                <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
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