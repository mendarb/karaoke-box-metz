export interface BookingSettings {
  isTestMode: boolean;
  bookingWindow: {
    startDate: Date;
    endDate: Date;
  };
  openingHours: {
    [key: number]: {  // 0 = Dimanche, 1 = Lundi, etc.
      isOpen: boolean;
      slots: string[];
    };
  };
  excludedDays: Date[];
  basePrice: {
    perHour: number;
    perPerson: number;
  };
}

export const defaultSettings: BookingSettings = {
  isTestMode: false,
  bookingWindow: {
    startDate: new Date(),
    endDate: new Date(),
  },
  openingHours: {
    0: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Dimanche
    1: { isOpen: false, slots: [] }, // Lundi - Fermé
    2: { isOpen: false, slots: [] }, // Mardi - Fermé
    3: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Mercredi
    4: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Jeudi
    5: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Vendredi
    6: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Samedi
  },
  excludedDays: [],
  basePrice: {
    perHour: 30,
    perPerson: 5,
  },
};