export const convertJsWeekDayToSettings = (jsWeekDay: number): string => {
  // JavaScript: 0 (dimanche) - 6 (samedi)
  // Notre format: 1 (lundi) - 7 (dimanche)
  const settingsWeekDay = jsWeekDay === 0 ? 7 : jsWeekDay;
  
  console.log('🔄 Conversion jour:', { 
    jsWeekDay, 
    settingsWeekDay,
    jsDay: getDayName(jsWeekDay),
    settingsDay: getDayName(jsWeekDay)
  });
  
  return String(settingsWeekDay);
};

const getDayName = (jsWeekDay: number): string => {
  const days = {
    0: 'Dimanche',
    1: 'Lundi',
    2: 'Mardi',
    3: 'Mercredi',
    4: 'Jeudi',
    5: 'Vendredi',
    6: 'Samedi'
  };
  return days[jsWeekDay as keyof typeof days];
};

export const getDateRange = (settings: any, isTestMode: boolean) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const minDate = isTestMode 
    ? today
    : new Date(today.setDate(today.getDate() + (settings?.bookingWindow?.startDays || 1)));
    
  const maxDate = isTestMode
    ? new Date(today.setFullYear(today.getFullYear() + 1))
    : new Date(today.setDate(today.getDate() + (settings?.bookingWindow?.endDays || 30)));

  return { minDate, maxDate };
};

export const isDayExcluded = (date: Date, settings: any): boolean => {
  if (!settings?.openingHours) {
    console.log('❌ Pas de paramètres d\'horaires');
    return true;
  }

  const settingsWeekDay = convertJsWeekDayToSettings(date.getDay());
  const daySettings = settings.openingHours[settingsWeekDay];

  console.log('📅 Vérification disponibilité:', {
    date: date.toISOString(),
    jsWeekDay: date.getDay(),
    settingsWeekDay,
    daySettings,
    isOpen: daySettings?.isOpen,
    openingHours: settings.openingHours
  });

  if (!daySettings?.isOpen) {
    console.log('❌ Jour fermé ou pas de créneaux:', {
      date: date.toISOString(),
      isOpen: daySettings?.isOpen,
      slots: daySettings?.slots
    });
    return true;
  }

  console.log('✅ Jour disponible:', date.toISOString());
  return false;
};