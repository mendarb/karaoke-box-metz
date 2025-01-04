interface GallerySectionProps {
  images?: string[];
  title?: string;
}

export const GallerySection = ({ 
  images = [
    "/lovable-uploads/1d50de50-0e08-4925-906c-fa1b9888dccf.png",
    "/lovable-uploads/a04b0d99-a1db-45be-85bd-ad406a58497b.png",
    "/lovable-uploads/3b342a8e-f225-4a8a-b3ce-72a9d6614e39.png"
  ],
  title = "Nos moments karaoké"
}: GallerySectionProps) => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">{title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <img 
              key={index}
              src={image}
              alt={`Moment karaoké ${index + 1}`}
              className="rounded-lg shadow-lg hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </div>
    </div>
  );
};