import { motion } from "framer-motion";

interface LandingFooterProps {
  links?: Array<{
    text: string;
    url: string;
  }>;
  socialLinks?: Array<{
    icon: React.ReactNode;
    url: string;
  }>;
}

export const LandingFooter = ({
  links = [],
  socialLinks = []
}: LandingFooterProps) => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div>
            <h3 className="text-xl font-semibold mb-4">À propos</h3>
            <p className="text-gray-400">
              Découvrez une expérience unique d'escape game à Metz. Relevez des défis passionnants en équipe et créez des souvenirs inoubliables.
            </p>
          </div>

          {links.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Liens utiles</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Escape Game Metz. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};