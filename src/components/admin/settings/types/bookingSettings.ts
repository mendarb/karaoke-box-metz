export interface BookingSettings {
  isTestMode: boolean;
  bookingWindow: {
    startDays: number;
    endDays: number;
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
  bookingWindow: { startDays: 1, endDays: 30 },
  openingHours: {
    0: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Lundi
    1: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Mardi
    2: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Mercredi
    3: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Jeudi
    4: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Vendredi
    5: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Samedi
    6: { isOpen: true, slots: ["17:00", "18:00", "19:00", "20:00", "21:00"] }, // Dimanche
  },
  excludedDays: [],
  basePrice: { perHour: 30, perPerson: 5 },
};