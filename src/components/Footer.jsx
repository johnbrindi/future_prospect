import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { Github, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="FutureProspect Logo" className="h-8 w-auto" />
              <span className="font-semibold text-xl tracking-tight text-gray-900">
                FutureProspect
              </span>
            </Link>
            <p className="text-gray-600">
              Connecting University of Bamenda students with local companies for 
              meaningful internship opportunities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/johnbrindi/future_prospect.git" className="text-gray-500 hover:text-primary transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-4">For Students</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/student-register" className="text-gray-600 hover:text-primary transition-colors">
                  Student Registration
                </Link>
              </li>
              <li>
                <Link to="/internships" className="text-gray-600 hover:text-primary transition-colors">
                  Browse Internships
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-600 hover:text-primary transition-colors">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-4">For Companies</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/company-register" className="text-gray-600 hover:text-primary transition-colors">
                  Company Registration
                </Link>
              </li>
              <li>
                <Link to="/post-internship" className="text-gray-600 hover:text-primary transition-colors">
                  Post Internship
                </Link>
              </li>
              <li>
                <Link to="/talent-search" className="text-gray-600 hover:text-primary transition-colors">
                  Find Talent
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-gray-600">
                University of Bamenda, NW Region, Cameroon
              </li>
              <li>
                <a href="mailto:info@futureprospect.com" className="text-gray-600 hover:text-primary transition-colors">
                  info@futureprospect.com
                </a>
              </li>
              <li>
                <a href="tel:+237600000000" className="text-gray-600 hover:text-primary transition-colors">
                  +237 650 146 590
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-primary hover:text-primary/80 transition-colors">
                  Contact Page
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} FutureProspect. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-600 hover:text-primary transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;