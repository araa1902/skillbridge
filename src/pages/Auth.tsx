import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Building2, School, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Auth = () => {
  const [userType, setUserType] = useState<"student" | "employer" | "university">("student");
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validation
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    
    if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Navigate to appropriate dashboard based on user type
    setErrors({});
    if (userType === "student") {
      navigate("/student/dashboard");
    } else if (userType === "employer") {
      navigate("/employer/dashboard");
    } else {
      navigate("/university/dashboard");
    }
  };

  const userTypeConfig = {
    student: {
      icon: GraduationCap,
      title: "Students",
      description: "Discover projects, build experience, earn credentials"
    },
    employer: {
      icon: Building2,
      title: "Employers",
      description: "Post projects, discover talent, build teams"
    },
    university: {
      icon: School,
      title: "Universities",
      description: "Manage student programs, track outcomes, connect industry"
    }
  };

  const config = userTypeConfig[userType];
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SB</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">SkillBridge</span>
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="space-y-3 text-center pb-6">
            <CardTitle className="text-3xl">
              {isLogin ? "Welcome Back" : "Get Started"}
            </CardTitle>
            <CardDescription className="text-base">
              {isLogin 
                ? "Sign in to your SkillBridge account" 
                : "Create your account to begin your journey"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* User Type Selector */}
            <div className="mb-6">
              <Tabs 
                value={userType} 
                onValueChange={(v) => setUserType(v as typeof userType)} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 bg-gray-100/50">
                  <TabsTrigger value="student" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600">
                    <GraduationCap className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">Student</span>
                  </TabsTrigger>
                  <TabsTrigger value="employer" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-green-600">
                    <Building2 className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">Employer</span>
                  </TabsTrigger>
                  <TabsTrigger value="university" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-purple-600">
                    <School className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">University</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* User Type Info */}
            <div className="mb-6 p-3 bg-gray-50/80 rounded-lg border border-gray-200/50">
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">{config.title}</p>
                  <p className="text-xs text-gray-600">{config.description}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Smith"
                    className="bg-white border-gray-300 placeholder:text-gray-400"
                    required 
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com"
                  className={`bg-white border-gray-300 placeholder:text-gray-400 ${errors.email ? "border-red-500" : ""}`}
                  required 
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium">Password</Label>
                  {isLogin && (
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700"
                      onClick={() => {}}
                    >
                      Forgot?
                    </Button>
                  )}
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-white border-gray-300 placeholder:text-gray-400 pr-10"
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="font-medium">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password"
                      placeholder="••••••••"
                      className="bg-white border-gray-300 placeholder:text-gray-400"
                      required 
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label 
                      htmlFor="terms" 
                      className="text-sm font-normal text-gray-600 cursor-pointer"
                    >
                      I agree to the{" "}
                      <Button variant="link" className="h-auto p-0 text-blue-600 hover:text-blue-700">
                        Terms of Service
                      </Button>
                    </Label>
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
              >
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              {userType === "student" && isLogin && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12 border-gray-300"
                >
                  Continue with University SSO
                </Button>
              )}
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <p className="text-center text-xs text-gray-600 mt-6">
          By continuing, you agree to our Privacy Policy and Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Auth;
