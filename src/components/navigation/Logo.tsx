import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex-1">
      <div className="hidden md:flex items-center gap-2">
        <img 
          src="/lovable-uploads/b4b03af7-d741-46f7-a7f3-e927b989289f.png" 
          alt="K.Box - Karaoké Privatif à Metz" 
          className="h-8 w-auto"
          width={32}
          height={32}
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="md:hidden">
        <img 
          src="/lovable-uploads/b4b03af7-d741-46f7-a7f3-e927b989289f.png" 
          alt="K.Box - Karaoké Privatif à Metz" 
          className="h-8 w-auto"
          width={32}
          height={32}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </Link>
  );
};