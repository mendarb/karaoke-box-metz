import { useState, useEffect, useCallback } from "react";
import { startOfDay, addDays, isSameDay } from "date-fns";
import { useBookingSettings } from "./useBookingSettings";
import { convertJsWeekDayToSettings } from "../utils/dateConversion";

interface UseDisabledDatesProps {
  minDate: Date;
  maxDate: Date;
  isDayExcluded: (date: Date) => boolean;
}

export const useDisabledDates = ({ minDate, maxDate, isDayExcluded }: UseDisabledDatesProps) => {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const { settings } = useBookingSettings();

  const calculateDisabledDates = useCallback(() => {
    console.log('🔄 Calcul des jours désactivés...');
    console.log('📊 Settings disponibles:', settings);
    
    if (!settings?.openingHours) {
      console.log('❌ Pas de paramètres disponibles, tous les jours sont désactivés');
      const allDates: Date[] = [];
      let currentDate = startOfDay(minDate);
      while (currentDate <= maxDate) {
        allDates.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
      }
      setDisabledDates(allDates);
      return;
    }

    const dates: Date[] = [];
    let currentDate = startOfDay(minDate);
    
    while (currentDate <= maxDate) {
      const jsWeekDay = currentDate.getDay();
      const settingsWeekDay = convertJsWeekDayToSettings(jsWeekDay);
      const daySettings = settings.openingHours[settingsWeekDay];
      
      console.log('📅 Vérification jour:', {
        date: currentDate.toISOString(),
        jsWeekDay,
        settingsWeekDay,
        isOpen: daySettings?.isOpen
      });

      // Un jour est désactivé s'il n'est pas configuré ou s'il est explicitement fermé
      if (!daySettings?.isOpen) {
        dates.push(new Date(currentDate));
      }

      currentDate = addDays(currentDate, 1);
    }

    // Ajouter les jours exclus spécifiques
    if (settings.excludedDays) {
      settings.excludedDays.forEach(excludedDay => {
        const excludedDate = new Date(excludedDay);
        if (!dates.some(date => isSameDay(date, excludedDate))) {
          dates.push(excludedDate);
        }
      });
    }

    console.log('📅 Jours désactivés:', dates.map(d => d.toISOString()));
    setDisabledDates(dates);
  }, [minDate, maxDate, settings]);

  useEffect(() => {
    calculateDisabledDates();
  }, [calculateDisabledDates]);

  return { disabledDates };
};