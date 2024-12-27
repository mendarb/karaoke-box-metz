import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageLightbox = ({ src, alt, className }: ImageLightboxProps) => {
  const handleClose = () => {
    const closeButton = document.querySelector('[data-radix-dialog-close-button]') as HTMLButtonElement | null;
    closeButton?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt}
          className={cn("cursor-pointer hover:opacity-90 transition-opacity", className)}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          <button 
            className="absolute top-2 right-2 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors z-50"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};