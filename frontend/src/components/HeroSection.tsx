import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
export const HeroSection = () => {
  return <section className="relative w-full min-h-screen bg-gradient-to-b from-[#2ECC71]/80 to-white flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518005068251-37900150dfca?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        {/* City skyline silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-[url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1470&auto=format&fit=crop')] bg-repeat-x bg-bottom opacity-10"></div>
      </div>
      <div className="container mx-auto px-4 py-16 pt-32 z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Making Cities <span className="text-[#FF8C42]">Cleaner</span> and{' '}
            <span className="text-[#FF8C42]">Smarter</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg mx-auto md:mx-0">
            Join Sri Lanka's innovative waste management solution connecting
            residents, workers, planners, and administrators in one ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/signup" className="px-6 py-3 bg-[#FF8C42] hover:bg-[#e67e3a] text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center">
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/login" className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg">
              Login as Worker/Admin
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1470&auto=format&fit=crop" alt="Smart Waste Management" className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 z-20" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#2ECC71] rounded-full opacity-70 z-10"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#FF8C42] rounded-full opacity-70 z-10"></div>
          </div>
        </div>
      </div>
    </section>;
};