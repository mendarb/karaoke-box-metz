import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img src="/lovable-uploads/apple pay.svg" alt="Logo" className="h-8" />
      <span className="font-bold text-xl">K-Box</span>
    </Link>
  );
};