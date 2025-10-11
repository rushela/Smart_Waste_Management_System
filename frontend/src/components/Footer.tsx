import { Recycle, Facebook, Linkedin, Mail, Phone } from 'lucide-react';
export const Footer = () => {
  return <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Recycle className="h-8 w-8 text-[#2ECC71]" />
              <span className="ml-2 font-bold text-lg">Smart Waste</span>
            </div>
            <p className="text-gray-400 mb-4">
              Making cities cleaner and smarter through innovative waste
              management solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#2ECC71]">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#2ECC71]">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#2ECC71]">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#2ECC71]">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#2ECC71]">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#2ECC71]">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#2ECC71]">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#2ECC71]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#2ECC71]">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#2ECC71]">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#2ECC71] mr-2" />
                <span className="text-gray-400">info@smartwaste.lk</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-[#2ECC71] mr-2" />
                <span className="text-gray-400">011-123-4567</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Smart Waste Management System. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};