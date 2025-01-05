import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export const HeroSection = ({ title, description, imageUrl }: HeroSectionProps) => {
  return (
    <div className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <img 
          src={imageUrl || "/lovable-uploads/368fa776-0398-40e7-9d72-47b5ebb78ca9.png"}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeIn leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
            {description}
          </p>
          <div className="flex gap-4">
            <Link to="/booking">
              <Button 
                size="lg" 
                className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Réserver maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="#features">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};