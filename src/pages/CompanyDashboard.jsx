import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building,
  BriefcaseBusiness,
  Users,
  MessageSquare,
  PieChart,
  Star,
  BookOpen,
  Award,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileEditor from "@/components/ProfileEditor";
import { InternshipManager } from "@/components/InternshipManager";
import { ApplicationManager } from "@/components/ApplicationManager";
import { DirectMessaging } from "@/components/DirectMessaging";
import { PerformanceAnalytics } from "@/components/PerformanceAnalytics";
import { FeedbackTools } from "@/components/FeedbackTools";
import ResourceCenter from "@/components/ResourceCenter";
import BrandingTools from "@/components/BrandingTools";

const CompanyDashboard = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const companyData = {
    name: "TechCorp Solutions",
    logo: "",
    industry: "Information Technology",
    location: "Bamenda, Cameroon",
    about: "Leading provider of innovative technology solutions with a focus on providing quality internships."
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileEditor onClose={() => {}} />;
      case "internships":
        return <InternshipManager />;
      case "applications":
        return <ApplicationManager />;
      case "messaging":
        return <DirectMessaging />;
      case "analytics":
        return <PerformanceAnalytics />;
      case "feedback":
        return <FeedbackTools />;
      case "resources":
        return <ResourceCenter />;
      case "branding":
        return <BrandingTools />;
      default:
        return null;
    }
  };

  const sidebarItems = [
    { id: "profile", label: "Company Profile", icon: Building },
    { id: "internships", label: "Internship Postings", icon: BriefcaseBusiness },
    { id: "applications", label: "Application Management", icon: Users },
    { id: "messaging", label: "Direct Messaging", icon: MessageSquare },
    { id: "analytics", label: "Performance Analytics", icon: PieChart },
    { id: "feedback", label: "Feedback Tools", icon: Star },
    { id: "resources", label: "Resource Center", icon: BookOpen },
    { id: "branding", label: "Branding Opportunities", icon: Award },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold text-primary">FutureProspect</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  TS
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{companyData.name}</p>
                <p className="text-xs text-gray-500">{companyData.industry}</p>
              </div>
            </div>
          </div>
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className={`h-5 w-5 ${
                  activeSection === item.id
                    ? "text-primary-foreground"
                    : "text-gray-500"
                }`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-semibold text-primary">FutureProspect</span>
        </Link>
        <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} size="icon">
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white pt-14 md:hidden"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    TS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{companyData.name}</p>
                  <p className="text-xs text-gray-500">{companyData.industry}</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className={`h-5 w-5 ${
                    activeSection === item.id
                      ? "text-primary-foreground"
                      : "text-gray-500"
                  }`} />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pt-0 pt-14">
        {/* Main Content Header */}
        <header className="bg-white border-b border-gray-200 p-4 md:p-6">
          <h1 className="text-2xl font-bold">
            {sidebarItems.find(item => item.id === activeSection)?.label}
          </h1>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;