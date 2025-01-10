export const calculateGroupSizeData = (bookings: any[]): { name: string; value: number }[] => {
  const groupSizeData = bookings?.reduce((acc: { [key: string]: number }, booking) => {
    const size = booking.group_size;
    acc[size] = (acc[size] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groupSizeData || {}).map(([size, count]) => ({
    name: `${size} pers.`,
    value: count as number,
  }));
};

export const calculateDurationData = (bookings: any[]): { name: string; value: number }[] => {
  const durationData = bookings?.reduce((acc: { [key: string]: number }, booking) => {
    const duration = `${booking.duration}min`;
    acc[duration] = (acc[duration] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(durationData || {}).map(([duration, count]) => ({
    name: duration,
    value: count as number,
  }));
};

export const calculateDayData = (bookings: any[]): { name: string; value: number }[] => {
  const dayData = bookings?.reduce((acc: { [key: string]: number }, booking) => {
    const date = new Date(booking.date);
    const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(dayData || {}).map(([day, count]) => ({
    name: day,
    value: count as number,
  }));
};

export const calculateStepData = (stepsTracking: any[]) => {
  const stepData = stepsTracking?.reduce((acc: any, track) => {
    acc[track.step] = acc[track.step] || { total: 0, completed: 0 };
    acc[track.step].total++;
    if (track.completed) {
      acc[track.step].completed++;
    }
    return acc;
  }, {});

  return Object.entries(stepData || {}).map(([step, data]: [string, any]) => ({
    name: `Étape ${step}`,
    total: data.total as number,
    completed: data.completed as number,
    dropoff: (data.total - data.completed) as number
  }));
};