"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/button";
import { Input } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/input";
import { Label } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/select";
import { Checkbox } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/checkbox";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Join SkillBridge</CardTitle>
          <CardDescription className="text-center">
            Connect talent with opportunity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">I'm a Student</TabsTrigger>
              <TabsTrigger value="business">I'm a Business</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student" className="space-y-4 mt-6">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university-email">University Email</Label>
                    <Input id="university-email" type="email" placeholder="john.doe@university.ac.uk" />
                    <p className="text-xs text-gray-500">Use your official university email for verification</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university">University</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your university" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oxford">University of Oxford</SelectItem>
                        <SelectItem value="cambridge">University of Cambridge</SelectItem>
                        <SelectItem value="imperial">Imperial College London</SelectItem>
                        <SelectItem value="ucl">University College London</SelectItem>
                        <SelectItem value="edinburgh">University of Edinburgh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="programme">Programme</Label>
                      <Input id="programme" placeholder="Computer Science" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year of Study</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="pg">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                  </div>
                  <Button className="w-full" size="lg" onClick={() => setStep(2)}>
                    Continue
                  </Button>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Skills & Interests</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Web Development", "Data Analysis", "Marketing", "Design", "Research", "Writing"].map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox id={skill} />
                          <label htmlFor={skill} className="text-sm">{skill}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 hours/week (Sprint Projects)</SelectItem>
                        <SelectItem value="20">20 hours/week (Standard Projects)</SelectItem>
                        <SelectItem value="ongoing">Ongoing Collaboration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" size="lg">
                    Create Student Account
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                    Back
                  </Button>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="business" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="Your Company Ltd" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-email">Business Email</Label>
                <Input id="business-email" type="email" placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-size">Company Size</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201+">201+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-password">Password</Label>
                <Input id="business-password" type="password" />
              </div>
              <Button className="w-full" size="lg">
                Create Business Account
              </Button>
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
