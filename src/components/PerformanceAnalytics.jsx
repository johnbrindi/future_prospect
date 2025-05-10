import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line } from "recharts";
import { ChevronUp, ChevronDown, Users, FileCheck, Clock, Award } from "lucide-react";

export const PerformanceAnalytics = () => {
  // Sample data
  const applicationsData = [
    { month: 'Jan', applications: 22 },
    { month: 'Feb', applications: 30 },
    { month: 'Mar', applications: 25 },
    { month: 'Apr', applications: 35 },
    { month: 'May', applications: 50 },
    { month: 'Jun', applications: 45 },
    { month: 'Jul', applications: 55 },
  ];
  
  const statusData = [
    { name: 'Pending', value: 12, color: '#CBD5E1' },
    { name: 'Shortlisted', value: 18, color: '#93C5FD' },
    { name: 'Interviewing', value: 8, color: '#C4B5FD' },
    { name: 'Accepted', value: 7, color: '#86EFAC' },
    { name: 'Rejected', value: 15, color: '#FCA5A5' },
  ];
  
  const sourceData = [
    { name: 'University Portal', value: 35 },
    { name: 'Direct Website', value: 25 },
    { name: 'Referrals', value: 15 },
    { name: 'Social Media', value: 10 },
    { name: 'Job Fairs', value: 15 },
  ];
  
  const comparisonData = [
    { month: 'Jan', current: 22, previous: 15 },
    { month: 'Feb', current: 30, previous: 20 },
    { month: 'Mar', current: 25, previous: 22 },
    { month: 'Apr', current: 35, previous: 25 },
    { month: 'May', current: 50, previous: 30 },
    { month: 'Jun', current: 45, previous: 35 },
    { month: 'Jul', current: 55, previous: 40 },
  ];

  // Summary statistics
  const summaryData = [
    {
      title: "Total Applications",
      value: 60,
      change: 15,
      changeText: "from last month",
      icon: Users,
      trend: "up",
    },
    {
      title: "Acceptance Rate",
      value: "27%",
      change: 5,
      changeText: "from last month",
      icon: FileCheck,
      trend: "up",
    },
    {
      title: "Avg. Response Time",
      value: "36h",
      change: 8,
      changeText: "from last month",
      icon: Clock,
      trend: "down",
    },
    {
      title: "Internship Completion",
      value: "92%",
      change: 3,
      changeText: "from last year",
      icon: Award,
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-primary/10 p-2">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                {item.trend === "up" ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <ChevronUp className="h-4 w-4" />
                    {item.change}%
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-sm">
                    <ChevronDown className="h-4 w-4" />
                    {item.change}%
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold">{item.value}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.title}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">{item.changeText}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
            <CardDescription>Monthly application trends for your internship postings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Application Status */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
            <CardDescription>Current status of all applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Year Over Year Comparison */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Year Over Year Comparison</CardTitle>
            <CardDescription>Compare current year with previous year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="previous" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Application Sources */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Application Sources</CardTitle>
            <CardDescription>Where applicants are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={sourceData} 
                  margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;