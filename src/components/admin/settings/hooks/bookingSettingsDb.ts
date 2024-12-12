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
        value: defaultSettings 
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

  console.log('Loaded settings:', existingSettings);
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