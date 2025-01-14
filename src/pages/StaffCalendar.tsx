import { Card } from "@/components/ui/card";
import { StaffAuth } from "@/components/staff/StaffAuth";
import { StaffCalendarView } from "@/components/staff/StaffCalendarView";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const StaffCalendar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedPassword = localStorage.getItem("staff_password");
    if (savedPassword) {
      validatePassword(savedPassword);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validatePassword = async (password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('validate-staff-password', {
        body: { password }
      });

      if (error) throw error;
      
      const isValid = data?.isValid || false;
      setIsAuthenticated(isValid);
      setIsLoading(false);
      return isValid;
    } catch (error) {
      console.error('Error validating password:', error);
      setIsLoading(false);
      return false;
    }
  };

  const handleLogin = async (password: string, rememberMe: boolean) => {
    const isValid = await validatePassword(password);
    if (isValid && rememberMe) {
      localStorage.setItem("staff_password", password);
    }
    return isValid;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("staff_password");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8 px-4 min-h-screen">
      <Card className="w-full">
        {isAuthenticated ? (
          <StaffCalendarView onLogout={handleLogout} />
        ) : (
          <StaffAuth onLogin={handleLogin} />
        )}
      </Card>
    </div>
  );
};