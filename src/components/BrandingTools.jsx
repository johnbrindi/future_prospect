import React from 'react';
import { Award, MessageSquare, Target, Users, Calendar, Download, Star, Image } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const BrandingTools = () => {
  const sponsorships = [
    {
      id: 1,
      title: "Career Fair Bronze Sponsorship",
      description: "Logo displayed at university career fairs, promotional materials included in student packets.",
      price: "$500",
      reach: "~1,000 students",
      duration: "One-time event"
    },
    {
      id: 2,
      title: "Workshop Series Sponsor",
      description: "Brand featured in monthly career workshops across multiple universities.",
      price: "$1,200",
      reach: "~2,500 students",
      duration: "3 months"
    },
    {
      id: 3,
      title: "Premium Platform Sponsor",
      description: "Featured placement on platform homepage, premium search visibility, and highlighted internships.",
      price: "$3,000",
      reach: "All platform users",
      duration: "6 months"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Tech Talk Series",
      description: "Host technical presentations for students interested in your industry.",
      availability: "Monthly slots available",
      commitment: "1-2 hours per session",
      audience: "Computer Science, Engineering"
    },
    {
      id: 2,
      title: "Industry Panel",
      description: "Participate in expert panels discussing career paths and industry trends.",
      availability: "Quarterly events",
      commitment: "3-4 hours, including prep",
      audience: "All majors"
    },
    {
      id: 3,
      title: "Hackathon Sponsorship",
      description: "Sponsor and judge university hackathons, with branded challenges.",
      availability: "Seasonal",
      commitment: "1-2 day event",
      audience: "Tech-focused students"
    }
  ];

  const resources = [
    {
      id: 1,
      title: "Branding Guidelines",
      description: "How to effectively showcase your brand to student audiences.",
      type: "PDF Guide",
      size: "1.5 MB"
    },
    {
      id: 2,
      title: "Social Media Templates",
      description: "Pre-designed templates for promoting your internships on social media.",
      type: "ZIP (PSD, AI files)",
      size: "8.2 MB"
    },
    {
      id: 3,
      title: "Brand Impact Report",
      description: "Analytics template for measuring the impact of your branding activities.",
      type: "Excel Template",
      size: "550 KB"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Branding Opportunities</CardTitle>
          <CardDescription>Promote your brand to potential interns and increase visibility</CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="sponsorships" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sponsorships">Sponsorships</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="resources">Branding Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sponsorships" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sponsorships.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {item.title}
                    <Award className="h-5 w-5 text-primary" />
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Investment:</span>
                      <span className="font-medium">{item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estimated Reach:</span>
                      <span className="font-medium">{item.reach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{item.duration}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {item.title}
                    <Calendar className="h-5 w-5 text-primary" />
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Availability:</span>
                      <span className="font-medium">{item.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time Commitment:</span>
                      <span className="font-medium">{item.commitment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target Audience:</span>
                      <span className="font-medium">{item.audience}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Register Interest</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {item.title}
                    <Image className="h-5 w-5 text-primary" />
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Resource Type:</span>
                      <span className="font-medium">{item.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">File Size:</span>
                      <span className="font-medium">{item.size}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download Resource
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandingTools;