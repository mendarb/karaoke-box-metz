import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageLightbox = ({ src, alt, className }: ImageLightboxProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt}
          className={cn("cursor-pointer hover:opacity-90 transition-opacity", className)}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] h-[90vh] p-0 bg-transparent border-none flex items-center justify-center relative">
        <button 
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          onClick={() => document.querySelector('[data-radix-dialog-close-button]')?.click()}
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain"
        />
      </DialogContent>
    </Dialog>
  );
};