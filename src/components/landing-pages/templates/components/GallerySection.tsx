import { motion } from "framer-motion";

interface Image {
  url: string;
  alt: string;
}

interface GallerySectionProps {
  title: string;
  subtitle?: string;
  images: Image[];
}

export const GallerySection = ({
  title,
  subtitle,
  images
}: GallerySectionProps) => {
  const defaultImages = [
    { url: "/lovable-uploads/1d50de50-0e08-4925-906c-fa1b9888dccf.png", alt: "KBOX Ambiance 1" },
    { url: "/lovable-uploads/3b342a8e-f225-4a8a-b3ce-72a9d6614e39.png", alt: "KBOX Ambiance 2" },
    { url: "/lovable-uploads/71abef1d-375e-47bb-afb7-77d8435491e6.png", alt: "KBOX Ambiance 3" },
  ];

  const displayImages = images.length > 0 ? images : defaultImages;

  return (
    <section className="py-20 bg-gradient-to-br from-white to-kbox-pink/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};