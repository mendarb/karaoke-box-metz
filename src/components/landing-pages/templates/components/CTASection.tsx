import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CTASectionProps {
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

export const CTASection = ({
  title,
  description,
  ctaText = "Réserver maintenant",
  ctaLink = "/booking",
  imageUrl
}: CTASectionProps) => {
  return (
    <section className="py-20 relative overflow-hidden">
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${imageUrl ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          {description && (
            <p className={`text-lg mb-8 ${imageUrl ? 'text-white/90' : 'text-gray-600'}`}>
              {description}
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