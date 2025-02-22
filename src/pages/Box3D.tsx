import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BoxFeatures } from "@/components/3d/BoxFeatures";
import Footer from "@/components/home/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Box3D = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    "/lovable-uploads/1b7097ed-462c-4d52-9925-7bcd936d3b0b.png",
    "/lovable-uploads/157fd2f1-9efc-4a13-a414-2be1af92de9d.png",
    "/lovable-uploads/7186434f-c7e0-403f-988a-8a91cb523a66.png",
    "/lovable-uploads/90237877-fe16-4e2d-87bf-a89afe536a6a.png",
    "/lovable-uploads/9c0b6639-b52e-465d-be6b-e82b447d21c5.png",
    "/lovable-uploads/4704aa85-038c-4e47-8a9e-240bae94ec28.png"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-kbox-coral hover:text-kbox-orange-dark transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-kbox-coral">
          Notre Box Karaoké
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div 
                      className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Box karaoké vue ${index + 1}`}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] max-h-[95vh] p-4 bg-black/95">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={image}
                        alt={`Box karaoké vue ${index + 1}`}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Découvrez notre box karaoké privative, un espace unique et confortable pour chanter vos chansons préférées entre amis. 
              Profitez d'une ambiance festive avec notre système de son professionnel, nos éclairages d'ambiance et notre boule à facettes.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <BoxFeatures />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Box3D;