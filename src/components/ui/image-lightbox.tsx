import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
      <DialogContent className="max-w-[90vw] h-[90vh] p-0 bg-transparent border-none flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain"
        />
      </DialogContent>
    </Dialog>
  );
};