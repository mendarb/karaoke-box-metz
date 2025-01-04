import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CTASectionProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export const CTASection = ({ 
  title = "Prêt à vivre l'expérience ?",
  description = "Réservez votre box karaoké et créez des souvenirs inoubliables",
  imageUrl = "/lovable-uploads/9edff13a-68e4-478f-857e-0f552b0ef61d.png"
}: CTASectionProps) => {
  return (
    <div className="relative py-24">
      <div className="absolute inset-0">
        <img 
          src={imageUrl}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-violet-900/90" />
      </div>
      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white space-y-8">
          <h2 className="text-4xl font-bold">
            {title}
          </h2>
          <p className="text-xl">
            {description}
          </p>
          <Link to="/booking">
            <Button 
              size="lg"
              className="bg-white text-violet-600 hover:bg-gray-100"
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