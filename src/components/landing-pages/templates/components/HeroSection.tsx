import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const HeroSection = ({
  title,
  subtitle,
  imageUrl,
  ctaText = "Réserver maintenant",
  ctaLink = "/booking"
}: HeroSectionProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      
      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {subtitle}
            </p>
          )}
          <Button
            size="lg"
            className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg"
            asChild
          >
            <a href={ctaLink}>{ctaText}</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};