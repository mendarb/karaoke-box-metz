export const calculateGroupSizeData = (bookings: any[]) => {
  const groupSizeData = bookings?.reduce((acc: any, booking) => {
    const size = booking.group_size;
    acc[size] = (acc[size] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groupSizeData || {}).map(([size, count]) => ({
    name: `${size} pers.`,
    value: count,
  }));
};

export const calculateDurationData = (bookings: any[]) => {
  const durationData = bookings?.reduce((acc: any, booking) => {
    const duration = `${booking.duration}min`;
    acc[duration] = (acc[duration] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(durationData || {}).map(([duration, count]) => ({
    name: duration,
    value: count,
  }));
};

export const calculateDayData = (bookings: any[]) => {
  const dayData = bookings?.reduce((acc: any, booking) => {
    const date = new Date(booking.date);
    const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(dayData || {}).map(([day, count]) => ({
    name: day,
    value: count,
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
    total: data.total,
    completed: data.completed,
    dropoff: data.total - data.completed
  }));
};