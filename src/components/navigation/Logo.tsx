import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex-1 z-40">
      <div className="hidden md:flex items-center gap-2 px-4">
        <img 
          src="/lovable-uploads/b4b03af7-d741-46f7-a7f3-e927b989289f.png" 
          alt="K.Box" 
          className="h-8 w-auto"
          width={32}
          height={32}
          loading="eager"
        />
      </div>
      <div className="md:hidden px-4">
        <img 
          src="/lovable-uploads/b4b03af7-d741-46f7-a7f3-e927b989289f.png" 
          alt="K.Box" 
          className="h-8 w-auto"
          width={32}
          height={32}
          loading="eager"
        />
      </div>
    </Link>
  );
};