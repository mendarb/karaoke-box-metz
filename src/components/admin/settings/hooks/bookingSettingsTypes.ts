export interface BookingSettings {
  isTestMode: boolean;
  bookingWindow: {
    startDate: Date;
    endDate: Date;
  };
  openingHours: {
    [key: string]: {
      isOpen: boolean;
      slots: string[];
    };
  };
  excludedDays: number[];
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
    1: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Lundi
    2: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Mardi
    3: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Mercredi
    4: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Jeudi
    5: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Vendredi
    6: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Samedi
    7: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Dimanche
  },
  excludedDays: [],
  basePrice: {
    perHour: 30,
    perPerson: 5,
  },
};