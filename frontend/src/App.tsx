import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeatureCards } from './components/FeatureCards';
import { HowItWorks } from './components/HowItWorks';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LoginSection } from './components/LoginSection';
import { Footer } from './components/Footer';
export function App() {
  return <div className="flex flex-col min-h-screen w-full bg-white font-[Inter,sans-serif]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureCards />
        <HowItWorks />
        <AnalyticsDashboard />
        {/* <LoginSection /> */}
      </main>
      <Footer />
    </div>;
}