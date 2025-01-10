interface AnalyticsStats {
  currentPeriod: {
    registeredUsers: number;
    startedBookings: number;
    paidBookings: number;
    adminBookings: number;
    confirmedAccounts: number;
    conversionRate: number;
  };
  variations: {
    registeredUsers: number;
    startedBookings: number;
    paidBookings: number;
    adminBookings: number;
    confirmedAccounts: number;
    conversionRate: number;
  };
}

export const calculateAnalyticsStats = (
  currentBookings: any[],
  previousBookings: any[],
  currentEvents: any[],
  previousEvents: any[]
): AnalyticsStats => {
  // Current period calculations
  const registeredUsers = currentEvents?.filter(e => e.event_type === 'SIGNUP').length || 0;
  const startedBookings = currentEvents?.filter(e => e.event_type === 'BOOKING_STARTED').length || 0;
  const paidBookings = currentBookings?.filter(b => b.payment_status === 'paid').length || 0;
  const adminBookings = currentBookings?.filter(b => b.is_admin_booking).length || 0;
  const confirmedAccounts = currentEvents?.filter(e => e.event_type === 'EMAIL_CONFIRMED').length || 0;
  const conversionRate = startedBookings > 0 ? Math.round((paidBookings / startedBookings) * 100) : 0;

  // Previous period calculations
  const prevRegisteredUsers = previousEvents?.filter(e => e.event_type === 'SIGNUP').length || 0;
  const prevStartedBookings = previousEvents?.filter(e => e.event_type === 'BOOKING_STARTED').length || 0;
  const prevPaidBookings = previousBookings?.filter(b => b.payment_status === 'paid').length || 0;
  const prevAdminBookings = previousBookings?.filter(b => b.is_admin_booking).length || 0;
  const prevConfirmedAccounts = previousEvents?.filter(e => e.event_type === 'EMAIL_CONFIRMED').length || 0;
  const prevConversionRate = prevStartedBookings > 0 ? Math.round((prevPaidBookings / prevStartedBookings) * 100) : 0;

  // Calculate variations
  const calculateVariation = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    currentPeriod: {
      registeredUsers,
      startedBookings,
      paidBookings,
      adminBookings,
      confirmedAccounts,
      conversionRate
    },
    variations: {
      registeredUsers: calculateVariation(registeredUsers, prevRegisteredUsers),
      startedBookings: calculateVariation(startedBookings, prevStartedBookings),
      paidBookings: calculateVariation(paidBookings, prevPaidBookings),
      adminBookings: calculateVariation(adminBookings, prevAdminBookings),
      confirmedAccounts: calculateVariation(confirmedAccounts, prevConfirmedAccounts),
      conversionRate: calculateVariation(conversionRate, prevConversionRate)
    }
  };
};

export const calculateGroupSizeData = (bookings: any[]): { name: string; value: number }[] => {
  const groupSizeData = bookings.reduce((acc: { [key: string]: number }, booking) => {
    const size = booking.group_size;
    acc[size] = (acc[size] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groupSizeData).map(([size, count]) => ({
    name: `${size} pers.`,
    value: count as number,
  }));
};

export const calculateDurationData = (bookings: any[]): { name: string; value: number }[] => {
  const durationData = bookings.reduce((acc: { [key: string]: number }, booking) => {
    const duration = `${booking.duration}min`;
    acc[duration] = (acc[duration] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(durationData).map(([duration, count]) => ({
    name: duration,
    value: count as number,
  }));
};

export const calculateDayData = (bookings: any[]): { name: string; value: number }[] => {
  const dayData = bookings.reduce((acc: { [key: string]: number }, booking) => {
    const date = new Date(booking.date);
    const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(dayData).map(([day, count]) => ({
    name: day,
    value: count as number,
  }));
};

export const calculateStepData = (stepsTracking: any[]) => {
  const stepData = stepsTracking.reduce((acc: any, track) => {
    acc[track.step] = acc[track.step] || { total: 0, completed: 0 };
    acc[track.step].total++;
    if (track.completed) {
      acc[track.step].completed++;
    }
    return acc;
  }, {});

  return Object.entries(stepData).map(([step, data]: [string, any]) => ({
    name: `Étape ${step}`,
    total: data.total,
    completed: data.completed,
    dropoff: data.total - data.completed
  }));
};
