import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { MapPin, Search, Book, User, Briefcase, Bell, Settings, LogOut, Home, MessageSquare, Clock, CheckCircle, FileText, Upload, Download, X, Filter, Calendar, ExternalLink, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import ChatBot from "@/components/ChatBot";
import ProfileEditor from "@/components/ProfileEditor";
import MessagingSystem from "@/components/MessagingSystem";
import LeafletMap from "@/components/LeafletMap";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getStudentByUserId } from "@/services/studentService";
import logo from "@/assets/logo.svg";
import { fetchInternships } from "@/company_api/api";

const recentInternships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "SEED",
    location: "Bamenda, Center Bolt",
    type: "Remote",
    postedDate: "2 days ago",
    logoColor: "#4F46E5",
    lat: 5.9597,
    lng: 10.1667,
    description: "TechBridge Solutions is looking for a motivated Frontend Developer Intern to join our growing team. You'll work on real-world projects using React, TypeScript, and modern web technologies.",
    requirement: "Knowledge in React, html, css",
    companyURL: "innovatewithseed.com",
    company_email: "johnbrindimazwewoh@gmail.com"
  },
  {
    id: 2,
    title: "Marketing Assistant",
    company: "Global Media Agency",
    location: "Bamenda, Up Station",
    type: "On-site",
    postedDate: "3 days ago",
    logoColor: "#10B981",
    lat: 5.9631,
    lng: 10.1589,
    description: "Join our marketing team to learn digital marketing strategies, social media management, and content creation while working with local businesses.",
    company_email: "johnbrindimazwewoh@gmail.com",

  },
  {
    id: 3,
    title: "Data Analyst Intern",
    company: "FinTech Innovations",
    location: "Bamenda, Finance Junction",
    type: "Hybrid",
    postedDate: "5 days ago",
    logoColor: "#F59E0B",
    lat: 5.9539,
    lng: 10.1456,
    description: "Work with our data science team to analyze financial data, build visualization dashboards, and contribute to our machine learning projects.",
    company_email: "johnbrindimazwewoh@gmail.com"
  },
  {
    id: 4,
    title: "UI/UX Design Intern",
    company: "SEED",
    location: "Bamenda, Center Bolt",
    type: "On-site",
    postedDate: "1 week ago",
    logoColor: "#EC4899",
    lat: 5.9578,
    lng: 10.1411,
    companyURL: "facebook.com",
    company_email: "barthez@email.com",
    description: "Join our design team to create user-centered designs, conduct usability research, and develop interactive prototypes for web and mobile applications."
  },
  {
    id: 5,  
    title: "Cyber Security Intern",
    company: "SEED",
    location: "Centre Bolt Mile 4",
    type: "Hybrid",
    postedDate: "Yesterday",
    logoColor: "#FF5733",  
    lat: 5.9600,  
    lng: 10.1600,  
    description: "Join the SEED team as a Cyber Security Intern to assist in protecting systems and networks from cyber threats.",
    requirement: "Knowledge in networking, cisco packet tracer.",
    companyURL: "innovatewithseed.com",
    company_email: "johnbrindimazwewoh@gmail.com"
  }
];

const applications = [
  {
    id: 1,
    title: "Backend Developer Intern",
    company: "CloudTech Systems",
    status: "Interview",
    date: "May 15, 2023",
    logoColor: "#6366F1",
  },
  {
    id: 2,
    title: "Content Writer Intern",
    company: "Media House Cameroon",
    status: "Applied",
    date: "May 12, 2023",
    logoColor: "#8B5CF6",
  },
  {
    id: 3,
    title: "Graphic Design Intern",
    company: "Art & Design Studio",
    status: "Rejected",
    date: "May 5, 2023",
    logoColor: "#EC4899",
  },
];

const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("dashboard");
  const [filteredInternships, setFilteredInternships] = useState(recentInternships);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showInternshipDetails, setShowInternshipDetails] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    type: "all",
    sortBy: "recent"
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const studentData = await getStudentByUserId(user.id);
        setProfile(studentData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  useEffect(() => {
    let results = [...recentInternships];
    
    if (searchQuery.trim()) {
      results = results.filter(
        internship =>
          internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filters.type !== "all") {
      results = results.filter(internship => internship.type === filters.type);
    }
    
    if (filters.sortBy === "recent") {
      // Already sorted by recent in our mock data
    } else if (filters.sortBy === "alphabetical") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredInternships(results);
  }, [searchQuery, filters]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowProfileEditor(false);
  };

  const handleViewInternship = (internship) => {
    setSelectedInternship(internship);
    setShowInternshipDetails(true);
  };

  const handleApplyNow = (internship) => {
    setSelectedInternship(internship);
    setShowApplicationForm(true);
  }; 

  const handleCloseModal = () => {
    setActiveView("dashboard");
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    toast("Application submitted successfully!");
    setShowApplicationForm(false);
  };

  const companyLocations = recentInternships.map(internship => ({
    id: internship.id.toString(),
    name: internship.company,
    lat: internship.lat,
    lng: internship.lng,
    industry: internship.title
  }));

  const handleMarkerClick = (company) => {
    const internshipId = parseInt(company.id);
    const selectedInternship = recentInternships.find(i => i.id === internshipId);
    
    if (selectedInternship) {
      setSelectedInternship(selectedInternship);
      setShowInternshipDetails(true);
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getProfileSkills = () => {
    if (profile?.skills && Array.isArray(profile.skills)) {
      return profile.skills;
    }
    return ["React", "TypeScript", "UI/UX Design"];
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-20 bg-background border-r border-gray-200 transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-[270px]'} md:static`}
      >
        <div className="p-4 flex items-center gap-2">
          {!sidebarCollapsed && <img src={logo} alt="FutureProspect Logo" className="h-8 w-auto" />}
          {!sidebarCollapsed && <span className="font-semibold text-gray-900">FutureProspect</span>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="ml-auto"
          >
            {sidebarCollapsed ? <Home size={20} /> : <X size={18} />}
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="px-4 py-2">
            <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'items-center gap-3'} mb-6`}>
              <Avatar className="h-10 w-10 border border-primary/10">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {profile?.full_name ? getInitials(profile.full_name) : (user?.email?.charAt(0).toUpperCase() || "U")}
                </AvatarFallback>
              </Avatar>
              
              {!sidebarCollapsed && (
                <div>
                  <h3 className="font-medium text-sm text-gray-900">
                    {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Student"}
                  </h3>
                  <p className="text-xs text-gray-500">{profile?.department || "Computer Science"} Student</p>
                </div>
              )}
            </div>
            
            {!sidebarCollapsed && profile?.bio && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Bio</h4>
                <p className="text-xs text-gray-600">{profile.bio}</p>
              </div>
            )}

            {!sidebarCollapsed && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {getProfileSkills().map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1 px-2">
            <Button 
              variant={activeView === "dashboard" ? "secondary" : "ghost"} 
              className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'}`}
              onClick={() => setActiveView("dashboard")}
            >
              <Home size={18} className="mr-2" />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </Button>
            
            <Button 
              variant={activeView === "search" ? "secondary" : "ghost"} 
              className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'}`}
              onClick={() => setActiveView("search")}
            >
              <Search size={18} className="mr-2" />
              {!sidebarCollapsed && <span>Find Internships</span>}
            </Button>
            
            <Button 
              variant={activeView === "map" ? "secondary" : "ghost"} 
              className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'}`}
              onClick={() => setActiveView("map")}
            >
              <MapPin size={18} className="mr-2" />
              {!sidebarCollapsed && <span>Map View</span>}
            </Button>
            
            <Button 
              variant={activeView === "applications" ? "secondary" : "ghost"} 
              className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'}`}
              onClick={() => setActiveView("applications")}
            >
              <Clock size={18} className="mr-2" />
              {!sidebarCollapsed && (
                <>
                  <span>Applications</span>
                  <Badge className="ml-auto">{applications.length}</Badge>
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'}`}
            >
              <Briefcase size={18} className="mr-2" />
              {!sidebarCollapsed && <span>Saved Jobs</span>}
            </Button>
            
            <Button 
              variant={activeView === "messages" ? "secondary" : "ghost"} 
              className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'}`}
              onClick={() => setActiveView("messages")}
            >
              <MessageSquare size={18} className="mr-2" />
              {!sidebarCollapsed && (
                <>
                  <span>Messages</span>
                  <Badge className="ml-auto">2</Badge>
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'}`}
            >
              <FileText size={18} className="mr-2" />
              {!sidebarCollapsed && <span>Resume</span>}
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-1 px-2">
            <Button 
              variant={activeView === "profile" ? "secondary" : "ghost"} 
              className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'}`}
              onClick={() => setShowProfileEditor(true)}
            >
              <User size={18} className="mr-2" />
              {!sidebarCollapsed && <span>Edit Profile</span>}
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'}`}
            >
              <Bell size={18} className="mr-2" />
              {!sidebarCollapsed && <span>Notifications</span>}
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'}`}
            >
              <Settings size={18} className="mr-2" />
              {!sidebarCollapsed && <span>Settings</span>}
            </Button>
          </div>

          <div className="mt-auto p-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/">
                <LogOut className={`${!sidebarCollapsed ? "mr-2" : ""} h-4 w-4`} />
                {!sidebarCollapsed && "Sign Out"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              {activeView === "dashboard" ? "Student Dashboard" : 
               activeView === "search" ? "Find Internships" :
               activeView === "applications" ? "My Applications" :
               activeView === "map" ? "Map View" : "Messages"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search internships..."
                className="w-64 pl-10"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {profile?.full_name ? getInitials(profile.full_name) : (user?.email?.charAt(0).toUpperCase() || "U")}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeView === "dashboard" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overview Cards */}
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Available Internships</p>
                      <h3 className="text-2xl font-semibold text-gray-900">10</h3>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Applications</p>
                      <h3 className="text-2xl font-semibold text-gray-900">{applications.length}</h3>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Upcoming Interviews</p>
                      <h3 className="text-2xl font-semibold text-gray-900">1</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <Tabs defaultValue="internships">
                  <TabsList className="mb-6">
                    <TabsTrigger value="internships">Recent Internships</TabsTrigger>
                    <TabsTrigger value="applications">My Applications</TabsTrigger>
                    <TabsTrigger value="recommended">AI Recommended</TabsTrigger>
                  </TabsList>

                  <TabsContent value="internships" className="space-y-4">
                    <Card className="mb-4 border-primary/20 bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex flex-wrap gap-4 items-center">
                          <div className="flex-1">
                            <p className="font-medium text-primary">Find your perfect internship match</p>
                            {/* <p className="text-sm text-gray-600">Our AI assistant can help recommend internships based on your profile and preferences</p> */}
                          </div>
                          {/* <Button onClick={() => toast("AI Recommendation feature activated!")}>
                            Get AI Recommendations
                          </Button> */}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">Type:</span>
                        <select 
                          className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
                          value={filters.type}
                          onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                          <option value="all">All</option>
                          <option value="Remote">Remote</option>
                          <option value="On-site">On-site</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">Sort by:</span>
                        <select 
                          className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
                          value={filters.sortBy}
                          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                          <option value="recent">Most Recent</option>
                          <option value="alphabetical">Alphabetical</option>
                        </select>
                      </div>
                    </div>

                    {filteredInternships.length > 0 ? (
                      filteredInternships.map((internship) => (
                        <Card key={internship.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                          <CardContent className="p-0">
                            <div className="flex items-start p-6">
                              <div className="mr-4 mt-1">
                                <Avatar className="h-12 w-12">
                                  <div style={{ backgroundColor: `${internship.logoColor}20`, color: internship.logoColor }} className="h-full w-full flex items-center justify-center font-semibold">
                                    {internship.company.split(' ').map(word => word[0]).join('')}
                                  </div>
                                </Avatar>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                                    <p className="text-gray-600">{internship.company}</p>
                                  </div>
                                  <Badge variant={internship.type === "Remote" ? "outline" : "secondary"} className="ml-2">
                                    {internship.type}
                                  </Badge>
                                </div>
                                <div className="mt-2 flex items-center text-gray-500 text-sm">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{internship.location}</span>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                  <span className="text-xs text-gray-500">Posted {internship.postedDate}</span>
                                  <div className="space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleViewInternship(internship)}
                                    >
                                      View Details
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={() => handleApplyNow(internship)}
                                    >
                                      Apply Now
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No internships match your search criteria.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="applications" className="space-y-4">
                    {applications.map((application) => (
                      <Card key={application.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                        <CardContent className="p-0">
                          <div className="flex items-start p-6">
                            <div className="mr-4 mt-1">
                              <Avatar className="h-12 w-12">
                                <div style={{ backgroundColor: `${application.logoColor}20`, color: application.logoColor }} className="h-full w-full flex items-center justify-center font-semibold">
                                  {application.company.split(' ').map(word => word[0]).join('')}
                                </div>
                              </Avatar>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{application.title}</h3>
                                  <p className="text-gray-600">{application.company}</p>
                                </div>
                                <Badge variant={
                                  application.status === "Interview" ? "default" :
                                  application.status === "Applied" ? "outline" : "destructive"
                                }>
                                  {application.status}
                                </Badge>
                              </div>
                              <div className="mt-2 text-gray-500 text-sm">
                                <span>Applied on {application.date}</span>
                              </div>
                              <div className="mt-4 flex justify-end space-x-2">
                                <Button variant="outline" size="sm">View Application</Button>
                                {application.status === "Interview" && (
                                  <Button size="sm">Prepare for Interview</Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="recommended" className="space-y-4">
                    <Card className="mb-4 border-primary/20 bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-primary">AI-Powered Recommendations</p>
                            <p className="text-sm text-gray-600">Based on your profile, skills, and preferences</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {filteredInternships.slice(0, 2).map((internship) => (
                      <Card key={internship.id} className="overflow-hidden transition-all duration-300 hover:shadow-md border-primary/30">
                        <CardContent className="p-0">
                          <div className="flex items-start p-6">
                            <div className="mr-4 mt-1">
                              <Avatar className="h-12 w-12">
                                <div style={{ backgroundColor: `${internship.logoColor}20`, color: internship.logoColor }} className="h-full w-full flex items-center justify-center font-semibold">
                                  {internship.company.split(' ').map(word => word[0]).join('')}
                                </div>
                              </Avatar>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Recommended</Badge>
                                </div>
                                <Badge variant={internship.type === "Remote" ? "outline" : "secondary"} className="ml-2">
                                  {internship.type}
                                </Badge>
                              </div>
                              <p className="text-gray-600">{internship.company}</p>
                              <div className="mt-2 flex items-center text-gray-500 text-sm">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{internship.location}</span>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Why we recommend this: </span>
                                  This position aligns with your skills and career interests.
                                </p>
                              </div>
                              <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs text-gray-500">Posted {internship.postedDate}</span>
                                <div className="space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewInternship(internship)}
                                  >
                                    View Details
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleApplyNow(internship)}
                                  >
                                    Apply Now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}

          {activeView === "search" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex-1 max-w-xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by role, company, or keyword..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Type:</span>
                  <select 
                    className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sort:</span>
                  <select 
                    className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                <div className="space-y-4">
                  {filteredInternships.length > 0 ? (
                    filteredInternships.map((internship) => (
                      <Card key={internship.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                        <CardContent className="p-0">
                          <div className="flex items-start p-6">
                            <div className="mr-4 mt-1">
                              <Avatar className="h-12 w-12">
                                <div style={{ backgroundColor: `${internship.logoColor}20`, color: internship.logoColor }} className="h-full w-full flex items-center justify-center font-semibold">
                                  {internship.company.split(' ').map(word => word[0]).join('')}
                                </div>
                              </Avatar>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                                  <p className="text-gray-600">{internship.company}</p>
                                </div>
                                <Badge variant={internship.type === "Remote" ? "outline" : "secondary"} className="ml-2">
                                  {internship.type}
                                </Badge>
                              </div>
                              <div className="mt-2 flex items-center text-gray-500 text-sm">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{internship.location}</span>
                              </div>
                              <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs text-gray-500">Posted {internship.postedDate}</span>
                                <div className="space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewInternship(internship)}
                                  >
                                    View Details
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleApplyNow(internship)}
                                  >
                                    Apply Now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No internships match your search criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeView === "applications" && (
            <div className="space-y-6">
              <Card className="mb-4 border-primary/20">
                <CardContent className="p-4">
                  <h3 className="font-medium">Application Tips</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Keep track of your applications and prepare for interviews. Don't forget to follow up after applying!
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                    <CardContent className="p-0">
                      <div className="flex items-start p-6">
                        <div className="mr-4 mt-1">
                          <Avatar className="h-12 w-12">
                            <div style={{ backgroundColor: `${application.logoColor}20`, color: application.logoColor }} className="h-full w-full flex items-center justify-center font-semibold">
                              {application.company.split(' ').map(word => word[0]).join('')}
                            </div>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{application.title}</h3>
                              <p className="text-gray-600">{application.company}</p>
                            </div>
                            <Badge variant={
                              application.status === "Interview" ? "default" :
                              application.status === "Applied" ? "outline" : "destructive"
                            }>
                              {application.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-gray-500 text-sm">
                            <span>Applied on {application.date}</span>
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline" size="sm">View Application</Button>
                            {application.status === "Interview" && (
                              <Button size="sm">Prepare for Interview</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeView === "map" && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Internship Locations in Bamenda</h2>
                  
                  <LeafletMap 
                    companyLocations={companyLocations}
                    onMarkerClick={handleMarkerClick}
                    height="500px"
                    defaultCenter={[5.9597, 10.1667]}
                    defaultZoom={13}
                  />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {recentInternships.map((company) => (
                  <Card key={company.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <div style={{ backgroundColor: `${company.logoColor}20`, color: company.logoColor }} className="h-full w-full flex items-center justify-center font-semibold">
                            {company.company.split(' ').map(word => word[0]).join('')}
                          </div>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{company.company}</h3>
                          <p className="text-xs text-gray-500">{company.location}</p>
                        </div>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm font-medium">Current Opening:</p>
                        <p className="text-sm">{company.title}</p>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewInternship(company)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeView === "messages" && (
            <div className="h-[calc(100vh-8rem)]">
              <MessagingSystem onClose={handleCloseModal} />
            </div>
          )}
        </main>
      </div>
      
      <ChatBot />

      {showProfileEditor && (
        <ProfileEditor 
          onClose={() => setShowProfileEditor(false)}
          profileData={profile}
          onUpdate={handleProfileUpdate}
        />
      )}

      <Dialog open={showInternshipDetails} onOpenChange={setShowInternshipDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedInternship?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <div style={{ backgroundColor: `${selectedInternship?.logoColor}20`, color: selectedInternship?.logoColor }} className="h-full w-full flex items-center justify-center font-semibold">
                  {selectedInternship?.company.split(' ').map(word => word[0]).join('')}
                </div>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedInternship?.company}</h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{selectedInternship?.location}</span>
                </div>
              </div>
              <Badge className="ml-auto" variant={selectedInternship?.type === "Remote" ? "outline" : "secondary"}>
                {selectedInternship?.type}
              </Badge>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Job Description</h4>
              <p className="text-sm text-gray-600">{selectedInternship?.description || 'No description provided.'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Requirements</h4>
              <p className="text-sm text-gray-600">{selectedInternship?.requirement || 'No Requirement listed.'}</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Location Details</h4>
              <LeafletMap 
                companyLocations={[{
                  id: selectedInternship?.id.toString() || '',
                  name: selectedInternship?.company || '',
                  lat: selectedInternship?.lat || 0,
                  lng: selectedInternship?.lng || 0,
                  industry: selectedInternship?.title
                }]}
                height="200px"
                defaultCenter={[selectedInternship?.lat || 0, selectedInternship?.lng || 0]}
                defaultZoom={15}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={() => {
                  window.open(`https://www.${selectedInternship?.companyURL.toLowerCase().replace(/\s+/g, '')}`, '_blank');
                  toast("Opening company website in new tab");
                }}
              >
                <ExternalLink size={16} />
                Visit Company Website
              </Button>

              <Button 
                variant="default" 
                onClick={() => {
                  setShowInternshipDetails(false);
                  handleApplyNow(selectedInternship);
                }}
              >
                Apply For This Position
              </Button>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowInternshipDetails(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for {selectedInternship?.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitApplication} className="space-y-4 pt-2">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <div style={{ backgroundColor: `${selectedInternship?.logoColor}20`, color: selectedInternship?.logoColor }} className="h-full w-full flex items-center justify-center font-semibold">
                  {selectedInternship?.company.split(' ').map(word => word[0]).join('')}
                </div>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedInternship?.company}</h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{selectedInternship?.location}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Upload Resume</label>
                <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Drop your resume here or click to browse</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 5MB</p>
                  <input type="file" className="hidden" accept=".pdf,.docx" />
                  <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cover Letter (Optional)</label>
                <Textarea 
                  placeholder="Tell the company why you're interested in this position..."
                  rows={5}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Relevant Experience</label>
                <Textarea 
                  placeholder="Share any relevant experience or projects..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowApplicationForm(false)}>Cancel</Button>
              <Button type="submit">Submit Application</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;