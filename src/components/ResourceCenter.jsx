import React from 'react';
import { File, Download, BookOpen, Video, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const ResourceCenter = () => {
  const documents = [
    {
      id: 1,
      title: "Internship Program Guidelines",
      description: "Official guidelines for running the internship program",
      type: "PDF",
      size: "1.2 MB",
      date: "2023-11-05",
      category: "guidelines"
    },
    {
      id: 2,
      title: "Mentor Handbook",
      description: "Best practices for mentoring interns",
      type: "DOC",
      size: "865 KB",
      date: "2023-12-10",
      category: "guidelines"
    },
    {
      id: 3,
      title: "Legal Templates",
      description: "Standard agreements and templates for interns",
      type: "ZIP",
      size: "2.3 MB",
      date: "2024-01-15",
      category: "legal"
    },
    {
      id: 4,
      title: "Onboarding Checklist",
      description: "Step-by-step process for onboarding new interns",
      type: "PDF",
      size: "750 KB",
      date: "2024-02-22",
      category: "templates"
    },
    {
      id: 5,
      title: "Performance Evaluation Forms",
      description: "Templates for evaluating intern performance",
      type: "DOC",
      size: "920 KB",
      date: "2024-01-30",
      category: "templates"
    }
  ];

  const videos = [
    {
      id: 1,
      title: "How to Create Effective Learning Plans",
      description: "Learn how to structure learning plans for interns",
      duration: "18:35",
      date: "2024-01-12"
    },
    {
      id: 2,
      title: "Providing Constructive Feedback",
      description: "Techniques for delivering effective feedback",
      duration: "22:10",
      date: "2024-02-05"
    },
    {
      id: 3,
      title: "Creating Inclusive Environments",
      description: "Best practices for fostering inclusion",
      duration: "15:45",
      date: "2024-03-15"
    }
  ];

  const links = [
    {
      id: 1,
      title: "University Career Services Directory",
      description: "Contact information for university partnerships",
      url: "#",
      category: "partnerships"
    },
    {
      id: 2,
      title: "Industry Best Practices Guide",
      description: "Latest practices for internship programs",
      url: "#",
      category: "guidelines"
    },
    {
      id: 3,
      title: "Government Internship Regulations",
      description: "Regulatory information for internship programs",
      url: "#",
      category: "legal"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Center</CardTitle>
          <CardDescription>Access documents, videos and links to help manage your internship program</CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="links">External Links</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <Badge variant="outline">{doc.type}</Badge>
                  </div>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-between border-t">
                  <div className="text-sm text-gray-500">
                    {doc.size} • {doc.date}
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <Badge variant="outline">{video.duration}</Badge>
                  </div>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-between border-t">
                  <div className="text-sm text-gray-500">
                    Added: {video.date}
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Video className="h-4 w-4" />
                    Watch
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="links" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {links.map((link) => (
              <Card key={link.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <Badge variant="outline">{link.category}</Badge>
                  </div>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-between border-t">
                  <div className="text-sm text-gray-500">
                    External Resource
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ExternalLink className="h-4 w-4" />
                    Visit
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

export default ResourceCenter;