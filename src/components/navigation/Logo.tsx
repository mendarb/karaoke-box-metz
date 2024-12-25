import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex-1">
      <div className="hidden md:flex items-center gap-2">
        <img 
          src="/lovable-uploads/85294882-1624-4fa6-a2d0-09d415c43674.png" 
          alt="K.Box" 
          className="h-8"
        />
        <span className="text-lg font-medium text-kbox-coral">
          KARAOKÉ PRIVATIF
        </span>
      </div>
      <div className="md:hidden">
        <img 
          src="/lovable-uploads/85294882-1624-4fa6-a2d0-09d415c43674.png" 
          alt="K.Box" 
          className="h-8"
        />
      </div>
    </Link>
  );
};