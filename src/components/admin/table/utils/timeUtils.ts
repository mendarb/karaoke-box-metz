export const formatTimeSlot = (timeSlot: string, duration?: string): string => {
  const startHour = parseInt(timeSlot.split(':')[0]);
  const endHour = duration ? startHour + parseInt(duration) : startHour + 1;
  return `${startHour}:00 - ${endHour}:00`;
};