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
    "1": { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] },
    "2": { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] },
    "3": { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] },
    "4": { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] },
    "5": { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] },
    "6": { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] },
    "7": { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] },
  },
  excludedDays: [],
  basePrice: {
    perHour: 30,
    perPerson: 5,
  },
};