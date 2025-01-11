interface AnalyticsStats {
  currentPeriod: {
    registeredUsers: number;
    startedBookings: number;
    paidBookings: number;
    adminBookings: number;
    confirmedAccounts: number;
    conversionRate: number;
    formStartCount: number;
  };
  variations: {
    registeredUsers: number;
    startedBookings: number;
    paidBookings: number;
    adminBookings: number;
    confirmedAccounts: number;
    conversionRate: number;
    formStartCount: number;
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
  const formStartCount = currentEvents?.filter(e => e.event_type === 'FORM_START').length || 0;

  // Previous period calculations
  const prevRegisteredUsers = previousEvents?.filter(e => e.event_type === 'SIGNUP').length || 0;
  const prevStartedBookings = previousEvents?.filter(e => e.event_type === 'BOOKING_STARTED').length || 0;
  const prevPaidBookings = previousBookings?.filter(b => b.payment_status === 'paid').length || 0;
  const prevAdminBookings = previousBookings?.filter(b => b.is_admin_booking).length || 0;
  const prevConfirmedAccounts = previousEvents?.filter(e => e.event_type === 'EMAIL_CONFIRMED').length || 0;
  const prevConversionRate = prevStartedBookings > 0 ? Math.round((prevPaidBookings / prevStartedBookings) * 100) : 0;
  const prevFormStartCount = previousEvents?.filter(e => e.event_type === 'FORM_START').length || 0;

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
      conversionRate,
      formStartCount
    },
    variations: {
      registeredUsers: calculateVariation(registeredUsers, prevRegisteredUsers),
      startedBookings: calculateVariation(startedBookings, prevStartedBookings),
      paidBookings: calculateVariation(paidBookings, prevPaidBookings),
      adminBookings: calculateVariation(adminBookings, prevAdminBookings),
      confirmedAccounts: calculateVariation(confirmedAccounts, prevConfirmedAccounts),
      conversionRate: calculateVariation(conversionRate, prevConversionRate),
      formStartCount: calculateVariation(formStartCount, prevFormStartCount)
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

export const calculateStepData = (events: any[]) => {
  // Filter events to only include booking steps tracking
  const stepsEvents = events.filter(event => 
    event.event_type === 'BOOKING_STARTED' ||
    event.event_type === 'FORM_START' ||
    event.event_type === 'PERSONAL_INFO_COMPLETED' ||
    event.event_type === 'DATE_TIME_COMPLETED' ||
    event.event_type === 'GROUP_SIZE_COMPLETED' ||
    event.event_type === 'PAYMENT_COMPLETED'
  );

  const stepMapping: { [key: string]: number } = {
    'BOOKING_STARTED': 1,
    'FORM_START': 1,
    'PERSONAL_INFO_COMPLETED': 1,
    'DATE_TIME_COMPLETED': 2,
    'GROUP_SIZE_COMPLETED': 3,
    'PAYMENT_COMPLETED': 4
  };

  const stepData = {
    'Étape 1': { total: 0, completed: 0 },
    'Étape 2': { total: 0, completed: 0 },
    'Étape 3': { total: 0, completed: 0 },
    'Étape 4': { total: 0, completed: 0 }
  };

  // Count total starts and completions for each step
  stepsEvents.forEach(event => {
    const step = stepMapping[event.event_type];
    if (step) {
      const stepKey = `Étape ${step}`;
      stepData[stepKey].total++;
      
      // Mark step as completed if it's a completion event
      if (event.event_type.includes('COMPLETED')) {
        stepData[stepKey].completed++;
      }
    }
  });

  // Convert to array format for the chart
  return Object.entries(stepData).map(([name, data]) => ({
    name,
    total: data.total,
    completed: data.completed,
    dropoff: data.total - data.completed
  }));
};
