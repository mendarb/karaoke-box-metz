export const formatTimeSlot = (timeSlot: string, duration: string): string => {
  const startHour = timeSlot.split(':')[0];
  const endHour = parseInt(startHour) + parseInt(duration);
  return `${startHour}:00 - ${endHour}:00`;
};