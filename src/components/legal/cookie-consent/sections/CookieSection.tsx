interface CookieSectionProps {
  title: string;
  description: string;
  items?: string[];
}

export const CookieSection = ({ title, description, items }: CookieSectionProps) => {
  return (
    <section className="space-y-2 sm:space-y-3">
      <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      {items && (
        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
};