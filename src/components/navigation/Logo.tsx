import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex flex-col items-center">
      <img 
        src="/lovable-uploads/4d1e4187-ec0c-4317-9793-55d355adc400.png" 
        alt="K.Box - Karaoké Privatif" 
        className="h-12 w-auto max-w-[180px] px-2"
      />
    </Link>
  );
};