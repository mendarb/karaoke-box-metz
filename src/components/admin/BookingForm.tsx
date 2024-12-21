import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PriceCalculator } from "@/components/PriceCalculator";
import { UserSelection } from "./booking-form/UserSelection";
import { BookingFormFields } from "./booking-form/BookingFormFields";
import { useAdminBookingSubmit } from "./booking-form/hooks/useAdminBookingSubmit";
import { PaymentLinkDisplay } from "./booking-form/PaymentLinkDisplay";
import { useBookingOverlap } from "@/hooks/useBookingOverlap";

export const AdminBookingForm = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      date: "",
      timeSlot: "",
      duration: "1",
      groupSize: "1",
      message: "",
      calculatedPrice: 0,
    },
  });

  const { checkOverlap } = useBookingOverlap();
  const { isLoading, paymentLink, handleSubmit } = useAdminBookingSubmit(form);

  const durations = ["1", "2", "3", "4"];
  const groupSizes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];

  const handlePriceCalculated = (price: number) => {
    form.setValue("calculatedPrice", price);
  };

  const onSubmit = async (data: any) => {
    // Vérifier les chevauchements
    const hasOverlap = await checkOverlap(data.date, data.timeSlot, data.duration);
    if (hasOverlap) return;

    await handleSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <UserSelection form={form} />

        <BookingFormFields 
          form={form}
          durations={durations}
          groupSizes={groupSizes}
          isLoading={isLoading}
        />

        <div className="mt-6">
          <PriceCalculator
            groupSize={form.watch("groupSize")}
            duration={form.watch("duration")}
            onPriceCalculated={handlePriceCalculated}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Création..." : "Créer la réservation"}
        </Button>

        {paymentLink && <PaymentLinkDisplay paymentLink={paymentLink} />}
      </form>
    </Form>
  );
};