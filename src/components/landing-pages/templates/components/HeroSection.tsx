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
    <div className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <img 
          src={imageUrl || "/lovable-uploads/368fa776-0398-40e7-9d72-47b5ebb78ca9.png"}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">{title}</h1>
          <p className="text-xl md:text-2xl mb-8">{description}</p>
          <Link to="/booking">
            <Button 
              size="lg" 
              className="bg-violet-600 hover:bg-violet-700 text-white border-2 border-white"
            >
              Réserver maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};