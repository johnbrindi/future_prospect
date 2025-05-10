import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UserTypeSelection from "@/components/UserTypeSelection";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import Features from "@/components/Features";
import { motion } from "framer-motion";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <Navbar />
      <HeroSection />
      <UserTypeSelection />
      <Features />
      <Footer />
      <ChatBot />
    </motion.div>
  );
};

export default Index;