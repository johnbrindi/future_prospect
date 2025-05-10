import React, { useState } from "react";
import { 
  Filter, 
  Search, 
  Download, 
  Mail, 
  Check, 
  X, 
  ChevronDown, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Users
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export const ApplicationManager = () => {
  const [applications, setApplications] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      university: "University of Bamenda",
      course: "Computer Science",
      resumeUrl: "#",
      applied: new Date(2023, 8, 20),
      photo: "",
      status: "pending",
      internshipTitle: "Software Development Intern"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      university: "University of Bamenda",
      course: "Computer Engineering",
      resumeUrl: "#",
      applied: new Date(2023, 8, 22),
      photo: "",
      status: "shortlisted",
      internshipTitle: "Software Development Intern"
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael.j@example.com",
      university: "Technical University of Bamenda",
      course: "Information Technology",
      resumeUrl: "#",
      applied: new Date(2023, 8, 23),
      photo: "",
      status: "interviewing",
      internshipTitle: "UI/UX Design Intern"
    },
    {
      id: "4",
      name: "Emily Williams",
      email: "emily.w@example.com",
      university: "University of Bamenda",
      course: "Graphic Design",
      resumeUrl: "#",
      applied: new Date(2023, 8, 25),
      photo: "",
      status: "accepted",
      internshipTitle: "UI/UX Design Intern"
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.b@example.com",
      university: "University of Bamenda",
      course: "Marketing",
      resumeUrl: "#",
      applied: new Date(2023, 9, 1),
      photo: "",
      status: "rejected",
      internshipTitle: "Marketing Assistant Intern"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [positionFilter, setPositionFilter] = useState(null);
  
  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-gray-200 text-gray-800";
      case "shortlisted": return "bg-blue-100 text-blue-800";
      case "interviewing": return "bg-purple-100 text-purple-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "shortlisted": return <AlertCircle className="h-4 w-4" />;
      case "interviewing": return <Users className="h-4 w-4" />;
      case "accepted": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setApplications(applications.map(app => 
      app.id === id ? {...app, status: newStatus} : app
    ));
  };

  const uniquePositions = [...new Set(applications.map(app => app.internshipTitle))];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    const matchesPosition = positionFilter ? app.internshipTitle === positionFilter : true;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search applicants..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-1" />
                Status
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("shortlisted")}>Shortlisted</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("interviewing")}>Interviewing</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("accepted")}>Accepted</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>Rejected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-1" />
                Position
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPositionFilter(null)}>All Positions</DropdownMenuItem>
              <DropdownMenuSeparator />
              {uniquePositions.map(position => (
                <DropdownMenuItem key={position} onClick={() => setPositionFilter(position)}>
                  {position}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map(app => (
            <Card key={app.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-4 md:p-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <Avatar className="h-12 w-12 mr-4">
                      {app.photo ? (
                        <AvatarImage src={app.photo} alt={app.name} />
                      ) : (
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {app.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{app.name}</h3>
                      <p className="text-sm text-gray-500">{app.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 md:mb-0 md:ml-6">
                    <div>
                      <p className="text-xs text-gray-500">University</p>
                      <p className="text-sm">{app.university}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Program</p>
                      <p className="text-sm">{app.course}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Position</p>
                      <p className="text-sm">{app.internshipTitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <Badge 
                      className={`flex items-center gap-1 px-2 py-1 ${getStatusColor(app.status)}`}
                    >
                      {getStatusIcon(app.status)}
                      <span className="capitalize">{app.status}</span>
                    </Badge>
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      Applied {app.applied.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex flex-wrap gap-2 justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Resume
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    Message
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Update Status
                        <ChevronDown className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(app.id, "pending")}
                        className="flex items-center"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(app.id, "shortlisted")}
                        className="flex items-center"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Shortlist
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(app.id, "interviewing")}
                        className="flex items-center"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Interview
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(app.id, "accepted")}
                        className="flex items-center text-green-600"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(app.id, "rejected")}
                        className="flex items-center text-red-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-1 flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">No applications found</h3>
            <p className="text-gray-500 mb-4 max-w-md">
              {searchTerm || statusFilter || positionFilter ? 
                "No applications match your current filters. Try adjusting your search criteria." : 
                "You haven't received any applications yet. Applications will appear here once students apply for your internship opportunities."}
            </p>
            {(searchTerm || statusFilter || positionFilter) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter(null);
                  setPositionFilter(null);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};