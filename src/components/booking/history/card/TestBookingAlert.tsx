interface TestBookingAlertProps {
  isTestBooking: boolean;
}

export const TestBookingAlert = ({ isTestBooking }: TestBookingAlertProps) => {
  if (!isTestBooking) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-md p-3">
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        Ceci est une réservation de test. Aucun paiement réel n'a été effectué.
      </p>
    </div>
  );
};