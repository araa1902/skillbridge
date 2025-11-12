import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GraduationCap, Building2, School } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Auth = () => {
  const [userType, setUserType] = useState<"student" | "employer" | "university">("student");
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to appropriate dashboard based on user type
    if (userType === "student") {
      navigate("/student/dashboard");
    } else if (userType === "employer") {
      navigate("/employer/dashboard");
    } else {
      navigate("/university/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isLogin ? "Welcome Back" : "Get Started"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? "Sign in to your account" : "Create your account to begin"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={userType} onValueChange={(v) => setUserType(v as typeof userType)} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student" className="text-xs">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="employer" className="text-xs">
                  <Building2 className="h-4 w-4 mr-1" />
                  Employer
                </TabsTrigger>
                <TabsTrigger value="university" className="text-xs">
                  <School className="h-4 w-4 mr-1" />
                  University
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Smith" required />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" required />
                </div>
              )}

              <Button type="submit" className="w-full">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>

              {userType === "student" && (
                <Button type="button" variant="outline" className="w-full">
                  Continue with University SSO
                </Button>
              )}
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-accent hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
