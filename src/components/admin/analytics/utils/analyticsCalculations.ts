interface AnalyticsStats {
  currentPeriod: {
    totalBookings: number;
    completedBookings: number;
    averageDuration: number;
    conversionRate: number;
  };
  variations: {
    totalBookings: number;
    completedBookings: number;
    conversionRate: number;
    averageDuration: number;
  };
}

export const calculateAnalyticsStats = (bookings: any[], stepsTracking: any[]): AnalyticsStats => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Filtrer les réservations pour les périodes actuelles et précédentes
  const currentBookings = bookings.filter(b => {
    const bookingDate = new Date(b.created_at);
    return bookingDate >= thirtyDaysAgo && bookingDate <= now;
  });

  const previousBookings = bookings.filter(b => {
    const bookingDate = new Date(b.created_at);
    return bookingDate >= sixtyDaysAgo && bookingDate < thirtyDaysAgo;
  });

  // Calculs pour la période actuelle
  const currentTotal = currentBookings.length;
  const currentCompleted = currentBookings.filter(b => b.payment_status === 'paid').length;
  const currentAverageDuration = currentBookings.length > 0
    ? Math.round(currentBookings.reduce((acc, b) => acc + Number(b.duration), 0) / currentBookings.length)
    : 0;

  // Calculs pour la période précédente
  const previousTotal = previousBookings.length;
  const previousCompleted = previousBookings.filter(b => b.payment_status === 'paid').length;
  const previousAverageDuration = previousBookings.length > 0
    ? Math.round(previousBookings.reduce((acc, b) => acc + Number(b.duration), 0) / previousBookings.length)
    : 0;

  // Calcul du taux de conversion
  const currentSessions = new Set(
    stepsTracking
      .filter(s => new Date(s.created_at) >= thirtyDaysAgo)
      .map(s => s.session_id)
  ).size;

  const previousSessions = new Set(
    stepsTracking
      .filter(s => {
        const date = new Date(s.created_at);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      })
      .map(s => s.session_id)
  ).size;

  const currentConversionRate = currentSessions > 0
    ? Math.round((currentCompleted / currentSessions) * 100)
    : 0;

  const previousConversionRate = previousSessions > 0
    ? Math.round((previousCompleted / previousSessions) * 100)
    : 0;

  // Calcul des variations
  const calculateVariation = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    currentPeriod: {
      totalBookings: currentTotal,
      completedBookings: currentCompleted,
      averageDuration: currentAverageDuration,
      conversionRate: currentConversionRate
    },
    variations: {
      totalBookings: calculateVariation(currentTotal, previousTotal),
      completedBookings: calculateVariation(currentCompleted, previousCompleted),
      conversionRate: calculateVariation(currentConversionRate, previousConversionRate),
      averageDuration: calculateVariation(currentAverageDuration, previousAverageDuration)
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