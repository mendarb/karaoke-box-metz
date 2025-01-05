import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CTASectionProps {
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const CTASection = ({
  title,
  description,
  ctaText = "Réserver maintenant",
  ctaLink = "/booking"
}: CTASectionProps) => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/d45fd1b9-de1b-40a3-ae6b-4072948883a6.png"
          alt="KBOX Ambiance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-kbox-violet/90 to-kbox-coral/90" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            {title}
          </h2>
          {description && (
            <p className="text-lg mb-8 text-white/90">
              {description}
            </p>
          )}
          <Button
            size="lg"
            className="bg-white hover:bg-gray-100 text-kbox-violet px-8 py-6 text-lg animate-pulse"
            asChild
          >
            <a href={ctaLink}>{ctaText}</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};