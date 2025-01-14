import { HeroSection } from "./HeroSection";
import { FeatureGrid } from "./FeatureGrid";
import BookingSection from "./BookingSection";
import Footer from "./Footer";

export const HomeContent = () => {
  return (
    <>
      <HeroSection />
      <FeatureGrid />
      <BookingSection />
      <Footer />
    </>
  );
};