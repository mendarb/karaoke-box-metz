import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export const HeroSection = ({ title, subtitle, imageUrl }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-black to-violet-900 overflow-hidden">
      {/* Background Image Grid */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 gap-4 p-4 opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-square overflow-hidden rounded-xl"
        >
          <img
            src="/lovable-uploads/6b69114f-a4aa-482c-8620-32a5893c833c.png"
            alt="Karaoké ambiance"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-square overflow-hidden rounded-xl"
        >
          <img
            src="/lovable-uploads/158727df-7fcf-40e4-aa8e-4bd89ff21d30.png"
            alt="Groupe karaoké"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative aspect-square overflow-hidden rounded-xl hidden md:block"
        >
          <img
            src="/lovable-uploads/88084d12-e2dc-416e-a867-bc4816a9e2ab.png"
            alt="Ambiance karaoké"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-6 backdrop-blur-sm bg-black/30 p-8 rounded-2xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-gray-200">
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              asChild
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Link to="/booking">
                Réserver maintenant
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/20"
            >
              <Link to="/box-3d">
                Découvrir en 3D
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};