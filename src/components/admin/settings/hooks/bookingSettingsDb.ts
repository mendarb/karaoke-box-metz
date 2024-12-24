import { supabase } from "@/lib/supabase";
import { BookingSettings, defaultSettings } from "./bookingSettingsTypes";

export const fetchBookingSettings = async (): Promise<BookingSettings> => {
  console.log('Fetching booking settings...');
  
  // Vérifier si les paramètres existent déjà
  const { data: existingSettings, error: fetchError } = await supabase
    .from('booking_settings')
    .select('*')
    .eq('key', 'booking_settings')
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching settings:', fetchError);
    throw fetchError;
  }

  // Si aucun paramètre n'existe, créer les paramètres par défaut
  if (!existingSettings) {
    console.log('No settings found, creating defaults...');
    const { data: newSettings, error: insertError } = await supabase
      .from('booking_settings')
      .insert([{ 
        key: 'booking_settings', 
        value: {
          ...defaultSettings,
          openingHours: {
            0: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Dimanche
            1: { isOpen: false, slots: [] }, // Lundi - Fermé
            2: { isOpen: false, slots: [] }, // Mardi - Fermé
            3: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Mercredi
            4: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Jeudi
            5: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Vendredi
            6: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Samedi
          }
        }
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating default settings:', insertError);
      throw insertError;
    }

    console.log('Default settings created:', newSettings);
    return newSettings.value;
  }

  // Mettre à jour les paramètres existants si nécessaire
  const currentSettings = existingSettings.value;
  const needsUpdate = currentSettings.openingHours[1]?.isOpen || currentSettings.openingHours[2]?.isOpen;

  if (needsUpdate) {
    console.log('Updating opening hours settings...');
    const updatedSettings = {
      ...currentSettings,
      openingHours: {
        0: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Dimanche
        1: { isOpen: false, slots: [] }, // Lundi - Fermé
        2: { isOpen: false, slots: [] }, // Mardi - Fermé
        3: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Mercredi
        4: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Jeudi
        5: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Vendredi
        6: { isOpen: true, slots: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"] }, // Samedi
      }
    };

    const { error: updateError } = await supabase
      .from('booking_settings')
      .update({ value: updatedSettings })
      .eq('key', 'booking_settings');

    if (updateError) {
      console.error('Error updating settings:', updateError);
      throw updateError;
    }

    console.log('Settings updated successfully');
    return updatedSettings;
  }

  console.log('Loaded settings:', existingSettings.value);
  return existingSettings.value;
};

export const saveBookingSettings = async (data: BookingSettings): Promise<BookingSettings> => {
  console.log('Starting settings save:', data);
  const { error: upsertError } = await supabase
    .from('booking_settings')
    .upsert({ 
      key: 'booking_settings',
      value: data 
    }, {
      onConflict: 'key'
    });

  if (upsertError) {
    console.error('Error saving settings:', upsertError);
    throw upsertError;
  }

  console.log('Settings saved successfully');
  return data;
};