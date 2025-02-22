import { ScrollArea } from "@/components/ui/scroll-area";
import { CookieSection } from "./sections/CookieSection";
import { cookieSectionsData } from "./data/cookieSectionsData";

export const CookieConsentContent = () => {
  return (
    <ScrollArea className="max-h-[50vh] sm:max-h-[60vh] pr-4">
      <div className="space-y-4 sm:space-y-6">
        {cookieSectionsData.map((section) => (
          <CookieSection
            key={section.title}
            title={section.title}
            description={section.description}
            items={section.items}
          />
        ))}
      </div>
    </ScrollArea>
  );
};