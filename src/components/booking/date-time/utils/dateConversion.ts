export const convertJsWeekDayToSettings = (jsWeekDay: number): string => {
  // JavaScript: 0 (dimanche) - 6 (samedi)
  // Notre format: 1 (lundi) - 7 (dimanche)
  const settingsWeekDay = jsWeekDay === 0 ? 7 : jsWeekDay;
  
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  console.log('🔄 Conversion jour:', { 
    jsWeekDay, 
    settingsWeekDay,
    jsDay: days[jsWeekDay],
    settingsDay: days[jsWeekDay]
  });
  
  return String(settingsWeekDay);
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

  if (!daySettings?.isOpen) {
    console.log('❌ Jour fermé:', { 
      date: date.toISOString(), 
      jsWeekDay: date.getDay(),
      settingsWeekDay,
      isOpen: daySettings?.isOpen,
      openingHours: settings.openingHours
    });
    return true;
  }

  return false;
};