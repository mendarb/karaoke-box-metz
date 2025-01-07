import { AuthForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/card";
import { Clock, Users, Calendar } from "lucide-react";

interface LoginSectionProps {
  user: any;
  onShowAuth: () => void;
}

export const LoginSection = ({ user, onShowAuth }: LoginSectionProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Colonne de gauche - Formulaire de connexion */}
        <div className="space-y-6">
          <div className="text-left space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">
              Créer votre compte
            </h1>
            <p className="text-lg text-gray-600">
              Commencez votre expérience karaoké dès maintenant
            </p>
          </div>
          <Card className="p-6 bg-white shadow-lg rounded-2xl border-0">
            <AuthForm 
              onClose={() => {}} 
              isLogin={false}
              onToggleMode={() => {}}
            />
          </Card>
        </div>

        {/* Colonne de droite - Informations */}
        <div className="space-y-8 lg:pl-8">
          <div className="grid gap-6">
            <div className="flex items-start space-x-4 p-4 bg-violet-50 rounded-xl">
              <Users className="w-6 h-6 text-violet-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Capacité d'accueil</h3>
                <p className="text-gray-600">Jusqu'à 10 personnes par session</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-violet-50 rounded-xl">
              <Clock className="w-6 h-6 text-violet-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Horaires d'ouverture</h3>
                <p className="text-gray-600">Du mercredi au dimanche, de 17h à 23h</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-violet-50 rounded-xl">
              <Calendar className="w-6 h-6 text-violet-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Réservation simple</h3>
                <p className="text-gray-600">Choisissez votre créneau en quelques clics</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-gradient-to-br from-violet-50 to-white p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-900">Le concept K.Box</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                K.Box vous propose une expérience karaoké unique dans un espace privatif
                moderne et confortable. Notre box est équipée d'un système audio professionnel
                et d'une sélection de plus de 2000 chansons en français et en anglais.
              </p>
              <p>
                Idéal pour les anniversaires, enterrements de vie de célibataire,
                soirées entre amis ou en famille. Profitez d'un moment convivial
                dans un cadre intimiste.
              </p>
              <ul className="list-disc list-inside space-y-2 pt-2">
                <li>Système audio professionnel</li>
                <li>Plus de 2000 titres disponibles</li>
                <li>Espace climatisé</li>
                <li>Service de boissons sur place</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};