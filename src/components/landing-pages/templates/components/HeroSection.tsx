import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export const HeroSection = ({ title, subtitle, imageUrl }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-kbox-pink to-white">
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
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
            className="bg-kbox-coral hover:bg-kbox-orange-dark text-white px-8 py-6 text-lg"
            asChild
          >
            <a href="/booking">Réserver maintenant</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};