import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex-1">
      <div className="hidden md:block text-xl font-bold text-violet-600 hover:text-violet-700">
        Karaoké Box
      </div>
      <div className="md:hidden">
        <img 
          src="/lovable-uploads/d45fd1b9-de1b-40a3-ae6b-4072948883a6.png" 
          alt="Karaoké Box" 
          className="h-8 w-8"
        />
      </div>
    </Link>
  );
};