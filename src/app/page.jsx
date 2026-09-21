'use client';

import Navbar from '@/components/Navbar';
import RoboticsHero from '@/components/RoboticsHero';
import ParticleSection from '@/components/ParticleSection';
import ApplicationsSection from '@/components/ApplicationsSection';
import ContactSection from '@/components/ContactUs';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="relative bg-[#E5E5E5] min-h-screen">
      <Navbar />
      <RoboticsHero />
      <ParticleSection />
      <ApplicationsSection/>  
      <ContactSection/>
      <Footer/>
    </main>
  );
}