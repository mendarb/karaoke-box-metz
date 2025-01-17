import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useUserState } from "@/hooks/useUserState";
import { supabase } from "@/lib/supabase";
import { BookingFormValues } from "../types/bookingFormTypes";

export const useBookingForm = () => {
  const { toast } = useToast();
  const { user } = useUserState();
  const [groupSize, setGroupSize] = useState("");
  const [duration, setDuration] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableHours, setAvailableHours] = useState(4);
  
  const form = useForm<BookingFormValues>({
    defaultValues: {
      email: user?.email || '',
      fullName: '',
      phone: '',
      date: undefined,
      timeSlot: '',
      groupSize: '',
      duration: '',
      message: ''
    }
  });

  const loadUserData = async () => {
    if (!user) return;

    try {
      const { data: lastBooking } = await supabase
        .from('bookings')
        .select('user_name, user_phone')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastBooking) {
        form.setValue('fullName', lastBooking.user_name);
        form.setValue('phone', lastBooking.user_phone);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos informations",
        variant: "destructive",
      });
    }
  };

  const handlePriceCalculated = (price: number) => {
    console.log('Price calculated:', price);
    setCalculatedPrice(price);
  };

  const handleAvailabilityChange = (date: Date | undefined, hours: number) => {
    setSelectedDate(date);
    setAvailableHours(hours);
    console.log('Available hours updated:', hours);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    form,
    groupSize,
    setGroupSize,
    duration,
    setDuration,
    currentStep,
    setCurrentStep,
    calculatedPrice,
    isSubmitting,
    setIsSubmitting,
    selectedDate,
    availableHours,
    handlePriceCalculated,
    handleAvailabilityChange,
    handlePrevious,
    toast
  };
};