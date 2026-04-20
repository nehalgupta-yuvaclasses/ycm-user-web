import { HeroSlider } from '@/components/shared/HeroSlider';
import { CoursesSection } from '@/features/courses/components/CoursesSection';
import { WhyChooseUs } from '@/components/shared/WhyChooseUs';
import { ResultsSection } from '@/features/courses/components/ResultsSection';
import { FacultySection } from '@/features/courses/components/FacultySection';
import { VideoSection } from '@/components/shared/VideoSection';
import { TestimonialsSection } from '@/features/testimonials/components/TestimonialsSection';
import { FAQSection } from '@/components/shared/FAQSection';
import { FinalCTA } from '@/components/shared/FinalCTA';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <CoursesSection />
      <WhyChooseUs />
      <ResultsSection />
      <FacultySection />
      <VideoSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
