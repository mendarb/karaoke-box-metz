export const InfoColumn = () => {
  return (
    <div className="hidden md:block relative h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-violet-900/80 mix-blend-multiply" />
      <img
        src="/lovable-uploads/245a691d-0576-40d2-91fb-cbd34455aec7.png"
        alt="Karaoké Box"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
        <h1 className="text-4xl font-bold mb-4">Votre Box Karaoké Privée</h1>
        <p className="text-lg opacity-90">
          Profitez d'une expérience unique dans notre box karaoké privée. 
          Un espace rien que pour vous et vos amis.
        </p>
      </div>
    </div>
  );
};