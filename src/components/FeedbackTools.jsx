import React, { useState } from 'react';
import { Star, MessageSquare, X, CheckCircle, Filter, ChevronDown, PlusCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export const FeedbackTools = () => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  const reviews = [
    {
      id: 1,
      internName: "Alex Johnson",
      avatar: "",
      program: "Frontend Development",
      date: "2024-03-15",
      rating: 4,
      comment: "Great learning experience. Mentorship was excellent and I gained valuable real-world skills. Would have liked more structured feedback sessions.",
      response: null,
    },
    {
      id: 2,
      internName: "Jamie Smith",
      avatar: "",
      program: "UX Design",
      date: "2024-02-20",
      rating: 5,
      comment: "Incredible internship! The team was supportive and I was given real projects to work on. My portfolio improved significantly.",
      response: "Thank you for your feedback, Jamie! We're glad you had a positive experience and were able to enhance your portfolio.",
    },
    {
      id: 3,
      internName: "Casey Taylor",
      avatar: "",
      program: "Data Analysis",
      date: "2024-01-10",
      rating: 3,
      comment: "Good technical experience but communication could be improved. Sometimes tasks weren't clearly defined.",
      response: null,
    },
  ];

  const surveys = [
    {
      id: 1,
      title: "End of Internship Evaluation",
      description: "Comprehensive evaluation of internship experience",
      status: "Active",
      responses: 18,
      created: "2024-02-15",
    },
    {
      id: 2,
      title: "Mentor Effectiveness Survey",
      description: "Feedback on mentorship quality and support",
      status: "Draft",
      responses: 0,
      created: "2024-03-01",
    },
    {
      id: 3,
      title: "Project Assignment Feedback",
      description: "Evaluation of project relevance and challenge level",
      status: "Completed",
      responses: 24,
      created: "2024-01-10",
    },
  ];

  const templates = [
    {
      id: 1,
      title: "Internship Exit Survey",
      description: "Comprehensive end-of-program feedback",
      questions: 15,
    },
    {
      id: 2,
      title: "Mentorship Evaluation",
      description: "Focused on mentor effectiveness",
      questions: 8,
    },
    {
      id: 3,
      title: "Weekly Check-in",
      description: "Quick pulse check for ongoing programs",
      questions: 5,
    },
    {
      id: 4,
      title: "Skills Assessment",
      description: "Evaluation of skill development",
      questions: 12,
    },
  ];

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="reviews" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Intern Reviews</TabsTrigger>
          <TabsTrigger value="surveys">Feedback Surveys</TabsTrigger>
        </TabsList>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Intern Reviews & Ratings</h3>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Filter Reviews</h4>
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Rating</div>
                      <div className="flex gap-1">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <Button key={rating} variant="outline" size="sm" className="h-8 w-8 p-0">
                            {rating}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Program</div>
                      <div className="grid grid-cols-2 gap-1">
                        <Button variant="outline" size="sm" className="text-xs justify-start">
                          Frontend
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs justify-start">
                          UX Design
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs justify-start">
                          Data
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs justify-start">
                          Backend
                        </Button>
                      </div>
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        Reset
                      </Button>
                      <Button size="sm">Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {review.internName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{review.internName}</h4>
                        <p className="text-sm text-gray-500">{review.program}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-1">{renderStars(review.rating)}</div>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm">{review.comment}</p>
                  
                  {review.response && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-md">
                      <p className="text-xs font-medium text-gray-500 mb-1">Your Response:</p>
                      <p className="text-sm">{review.response}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  {!review.response ? (
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Respond to Review
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="w-full text-gray-500">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Response Sent
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Surveys Tab */}
        <TabsContent value="surveys" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Feedback Surveys</h3>
            <Button onClick={() => setShowSurveyForm(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Survey
            </Button>
          </div>

          {/* Survey List */}
          {!showSurveyForm && (
            <div className="space-y-4">
              {surveys.map((survey) => (
                <Card key={survey.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{survey.title}</CardTitle>
                        <CardDescription>{survey.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          survey.status === "Active"
                            ? "default"
                            : survey.status === "Draft"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {survey.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Responses</p>
                        <p className="font-medium">{survey.responses}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Created</p>
                        <p className="font-medium">{survey.created}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Results
                    </Button>
                    <Button
                      variant={survey.status === "Active" ? "default" : "secondary"}
                      className="flex-1"
                    >
                      {survey.status === "Draft"
                        ? "Publish"
                        : survey.status === "Active"
                        ? "Share"
                        : "Duplicate"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Create Survey Form */}
          {showSurveyForm && (
            <Card>
              <CardHeader className="relative pb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4"
                  onClick={() => setShowSurveyForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardTitle>Create New Survey</CardTitle>
                <CardDescription>
                  Design a custom feedback survey or use a template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="surveyTitle" className="text-sm font-medium">
                    Survey Title
                  </label>
                  <Input
                    id="surveyTitle"
                    placeholder="Enter survey title"
                    value={surveyTitle}
                    onChange={(e) => setSurveyTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="surveyDesc" className="text-sm font-medium">
                    Description
                  </label>
                  <Input id="surveyDesc" placeholder="Enter survey description" />
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setShowTemplates(!showTemplates)}
                  >
                    <span>Use a Template</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {showTemplates && (
                    <div className="mt-2 border rounded-md">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                        >
                          <h4 className="font-medium">{template.title}</h4>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-gray-500">{template.description}</p>
                            <Badge variant="outline">{template.questions} questions</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    Survey builder is in development. Use templates for now or contact support for
                    custom surveys.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button variant="ghost" onClick={() => setShowSurveyForm(false)}>
                  Cancel
                </Button>
                <Button disabled={!surveyTitle.trim()}>Create Survey</Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackTools;