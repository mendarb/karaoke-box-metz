export const formatTimeSlot = (timeSlot: string, duration: string): string => {
  const startHour = parseInt(timeSlot);
  const endHour = startHour + parseInt(duration);
  return `${startHour}:00 - ${endHour}:00`;
};