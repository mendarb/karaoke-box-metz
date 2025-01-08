import { FeatureList } from "./FeatureList";
import { PaymentMethods } from "./PaymentMethods";

export const InfoColumn = () => {
  return (
    <div className="relative hidden md:block">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: 'url("/lovable-uploads/827450dc-c0dd-41bb-a327-eacaeda8445b.png")',
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-20 h-full flex flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-bold text-white">
              K.Box Metz - Box Karaoké
            </h1>
            <p className="text-base text-white/90">
              Votre espace karaoké privatif au cœur de Metz
            </p>
          </div>

          <FeatureList />
          <PaymentMethods />
        </div>
      </div>
    </div>
  );
};