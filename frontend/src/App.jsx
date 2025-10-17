import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeatureCards } from './components/FeatureCards';
import { HowItWorks } from './components/HowItWorks';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Footer } from './components/Footer';

// Combined App component that renders the primary layout components as well
// as the application router. The router can be used to switch between
// different pages or views while still displaying the main site structure.
export function App() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white font-[Inter,sans-serif]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureCards />
        <HowItWorks />
        <AnalyticsDashboard />
        {/* <LoginSection /> */}
      </main>
      <Footer />
    </div>
  );
}