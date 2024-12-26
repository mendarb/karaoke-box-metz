import { supabase } from "@/lib/supabase";

export const generatePaymentLink = async (data: any) => {
  console.log('💰 Début de génération du lien de paiement:', {
    email: data.email,
    originalPrice: data.calculatedPrice,
    finalPrice: data.finalPrice,
    promoCode: data.promoCode,
    discountAmount: data.discountAmount,
    isTestMode: data.isTestMode
  });

  try {
    const response = await supabase.functions.invoke('create-booking', {
      body: {
        userId: data.userId,
        userEmail: data.email,
        date: data.date,
        timeSlot: data.timeSlot,
        duration: data.duration,
        groupSize: data.groupSize,
        price: data.calculatedPrice,
        finalPrice: data.finalPrice || data.calculatedPrice,
        userName: data.fullName,
        userPhone: data.phone,
        isTestMode: data.isTestMode,
        promoCodeId: data.promoCodeId,
        promoCode: data.promoCode,
        discountAmount: data.discountAmount,
        message: data.message
      },
    });

    if (response.error) {
      console.error('❌ Erreur lors de la création de la session de paiement:', response.error);
      throw new Error(response.error.message || 'Échec de création de la session de paiement');
    }

    const { url } = response.data;
    
    if (!url) {
      console.error('❌ Pas d\'URL de paiement retournée');
      throw new Error('Pas d\'URL de paiement retournée');
    }

    console.log('✅ Lien de paiement généré avec succès:', {
      url,
      originalPrice: data.calculatedPrice,
      finalPrice: data.finalPrice,
      promoCode: data.promoCode,
      discountAmount: data.discountAmount,
      isTestMode: data.isTestMode
    });

    return url;
  } catch (error: any) {
    console.error('❌ Erreur lors de la génération du lien de paiement:', error);
    throw error;
  }
};