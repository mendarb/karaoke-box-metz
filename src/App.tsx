import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import "./styles/index.css";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;