import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="FutureProspect Logo" className="h-9 w-auto" />
          <span className="font-semibold text-xl tracking-tight text-gray-900">
            FutureProspect
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-primary transition-colors font-medium"
          >
            Home
          </Link>
          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors font-medium">
              For Students <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-2 px-3">
                <Link
                  to="/student-login"
                  className="block py-2 text-gray-700 hover:text-primary transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  to="/student-register"
                  className="block py-2 text-gray-700 hover:text-primary transition-colors"
                >
                  Student Register
                </Link>
                <Link
                  to="/internships"
                  className="block py-2 text-gray-700 hover:text-primary transition-colors"
                >
                  Browse Internships
                </Link>
              </div>
            </div>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors font-medium">
              For Companies <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-2 px-3">
                <Link
                  to="/company-login"
                  className="block py-2 text-gray-700 hover:text-primary transition-colors"
                >
                  Company Login
                </Link>
                <Link
                  to="/company-register"
                  className="block py-2 text-gray-700 hover:text-primary transition-colors"
                >
                  Company Register
                </Link>
                <Link
                  to="/post-internship"
                  className="block py-2 text-gray-700 hover:text-primary transition-colors"
                >
                  Post Internship
                </Link>
              </div>
            </div>
          </div>
          <Link
            to="/about"
            className="text-gray-700 hover:text-primary transition-colors font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-primary transition-colors font-medium"
          >
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/student-register">Sign up</Link>
          </Button>
        </div>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                to="/"
                className="py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/student-login"
                className="py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Student Login
              </Link>
              <Link
                to="/student-register"
                className="py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Student Register
              </Link>
              <Link
                to="/company-login"
                className="py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Company Login
              </Link>
              <Link
                to="/company-register"
                className="py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Company Register
              </Link>
              <Link
                to="/about"
                className="py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <hr className="my-2" />
              <div className="flex flex-col gap-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;