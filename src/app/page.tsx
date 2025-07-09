import Nav from '@/components/ui/Nav';
import Hero from '@/components/ui/Hero';
import Features from '@/components/ui/Features';
import LearningPath from '@/components/ui/LearningPath';
import Gamification from '@/components/ui/Gamification';
import InteractiveDemo from '@/components/ui/InteractiveDemo';
import Testimonials from '@/components/ui/Testimonials';
import Pricing from '@/components/ui/Pricing';
import Footer from '@/components/ui/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      {/* Main content sections with consistent spacing */}
      <div className="flex-grow">
        <Hero />
        <div className="section-divider"></div>
        <Features />
        {/* <div className="section-divider"></div> */}
        <LearningPath />
        {/* <div className="section-divider"></div> */}
        <Gamification />
        {/* <div className="section-divider"></div> */}
        <InteractiveDemo />
        {/* <div className="section-divider"></div> */}
        <Testimonials />
        {/* <div className="section-divider"></div> */}
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
