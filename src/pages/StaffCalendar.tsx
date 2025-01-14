import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { StaffAuth } from "@/components/staff/StaffAuth";
import { StaffCalendarView } from "@/components/staff/StaffCalendarView";

const STAFF_PASSWORD_KEY = "staff_password";

export const StaffCalendar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedPassword = localStorage.getItem(STAFF_PASSWORD_KEY);
    if (savedPassword) {
      validatePassword(savedPassword);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validatePassword = async (password: string) => {
    // Dans un environnement de production, cette validation devrait être faite côté serveur
    const isValid = password === import.meta.env.VITE_STAFF_PASSWORD;
    setIsAuthenticated(isValid);
    setIsLoading(false);
    return isValid;
  };

  const handleLogin = async (password: string, rememberMe: boolean) => {
    const isValid = await validatePassword(password);
    if (isValid && rememberMe) {
      localStorage.setItem(STAFF_PASSWORD_KEY, password);
    }
    return isValid;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STAFF_PASSWORD_KEY);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card className="max-w-5xl mx-auto">
        {!isAuthenticated ? (
          <StaffAuth onLogin={handleLogin} />
        ) : (
          <StaffCalendarView onLogout={handleLogout} />
        )}
      </Card>
    </div>
  );
};

export default StaffCalendar;