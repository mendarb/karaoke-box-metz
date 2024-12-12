export const formatTimeSlot = (timeSlot: string, duration?: string) => {
  if (!timeSlot) return '';
  
  const [startTime] = timeSlot.split('-');
  if (duration) {
    return `${startTime} (${duration})`;
  }
  return startTime;
};