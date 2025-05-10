import React, { useState } from 'react';
import { BriefcaseBusiness, Search, Plus, Filter, MoreVertical, Calendar, MapPin, Clock, Trash, Edit, Eye, Globe, Check, X as XIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const InternshipManager = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  
  // Sample internship data
  const activeInternships = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      department: "Engineering",
      location: "Remote",
      applicants: 18,
      posted: "2024-02-10",
      deadline: "2024-04-15",
      status: "active"
    },
    {
      id: 2,
      title: "UX/UI Design Intern",
      department: "Design",
      location: "Bamenda, Cameroon",
      applicants: 24,
      posted: "2024-02-05",
      deadline: "2024-03-30",
      status: "active"
    },
    {
      id: 3,
      title: "Data Analysis Intern",
      department: "Business Intelligence",
      location: "Hybrid",
      applicants: 12,
      posted: "2024-01-20",
      deadline: "2024-03-15",
      status: "active"
    }
  ];
  
  const draftInternships = [
    {
      id: 4,
      title: "Backend Developer Intern",
      department: "Engineering",
      location: "Remote",
      applicants: 0,
      posted: "",
      deadline: "2024-05-15",
      status: "draft"
    },
    {
      id: 5,
      title: "Marketing Intern",
      department: "Marketing",
      location: "Bamenda, Cameroon",
      applicants: 0,
      posted: "",
      deadline: "2024-06-01",
      status: "draft"
    }
  ];
  
  const closedInternships = [
    {
      id: 6,
      title: "Software QA Intern",
      department: "Quality Assurance",
      location: "Remote",
      applicants: 32,
      posted: "2023-11-01",
      deadline: "2024-01-15",
      status: "closed",
      hired: 2
    },
    {
      id: 7,
      title: "Project Management Intern",
      department: "Operations",
      location: "Bamenda, Cameroon",
      applicants: 20,
      posted: "2023-10-15",
      deadline: "2023-12-31",
      status: "closed",
      hired: 1
    }
  ];
  
  const allInternships = {
    active: activeInternships,
    draft: draftInternships,
    closed: closedInternships
  };
  
  const handleCreateInternship = () => {
    setOpenCreateDialog(false);
    // In a real app, this would create and add the internship to the list
  };
  
  const handleDeleteInternship = () => {
    // In a real app, this would delete the internship
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with search and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search internships..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" onClick={() => setOpenCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Internship
          </Button>
        </div>
      </div>
      
      {/* Tabs for different internship states */}
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active Internships
            <Badge variant="secondary" className="ml-2">
              {activeInternships.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts
            <Badge variant="secondary" className="ml-2">
              {draftInternships.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed
            <Badge variant="secondary" className="ml-2">
              {closedInternships.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {Object.keys(allInternships).map((tabKey) => (
          <TabsContent key={tabKey} value={tabKey} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allInternships[tabKey].map((internship) => (
                <Card key={internship.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg pr-8">{internship.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Internship
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedInternship(internship);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>{internship.department}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                        {internship.location}
                      </div>
                      {internship.status !== "draft" && (
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          Posted: {internship.posted}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        {internship.status === "closed"
                          ? "Closed on: "
                          : "Deadline: "}
                        {internship.deadline}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    {internship.status === "active" && (
                      <>
                        <Badge variant="outline" className="flex gap-1">
                          <BriefcaseBusiness className="h-3 w-3" />
                          {internship.applicants} Applicants
                        </Badge>
                        <Button size="sm">View Applicants</Button>
                      </>
                    )}
                    {internship.status === "draft" && (
                      <>
                        <Badge variant="outline">Draft</Badge>
                        <Button size="sm">Publish</Button>
                      </>
                    )}
                    {internship.status === "closed" && (
                      <>
                        <Badge variant="outline" className="flex gap-1">
                          <Check className="h-3 w-3" />
                          {internship.hired} Hired
                        </Badge>
                        <Button variant="outline" size="sm">
                          Reopen
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Create Internship Dialog */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Internship</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new internship posting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                placeholder="e.g. Frontend Developer Intern"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">On-site (Bamenda)</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter job description, requirements, and responsibilities"
                className="col-span-3"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInternship}>Create Internship</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Internship</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this internship posting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteInternship}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InternshipManager;