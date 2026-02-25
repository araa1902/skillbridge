import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Building2, School, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/types";

// Map UI user-type → DB role
const ROLE_MAP: Record<"student" | "employer" | "university", UserRole> = {
  student: "student",
  employer: "business",
  university: "university",
};

// Map DB role → dashboard path
const DASHBOARD_PATH: Record<UserRole, string> = {
  student: "/student/dashboard",
  business: "/employer/dashboard",
  university: "/university/dashboard",
};

const Auth = () => {
  const [userType, setUserType] = useState<"student" | "employer" | "university">("student");
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      const confirmPassword = (form.elements.namedItem("confirm-password") as HTMLInputElement).value;
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        // ── Sign In ──────────────────────────────────────────────────────
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
          setLoading(false);
          return;
        }

        toast({ title: "Signed in", description: "Welcome back!" });
        navigate("/student/dashboard");
      } else {
        // ── Sign Up ──────────────────────────────────────────────────────
        const fullName = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
        const role = ROLE_MAP[userType];

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role },
          },
        });

        if (error) {
          toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
          return;
        }

        // If email confirmation is required, Supabase returns a user but no session
        if (data.user && !data.session) {
          toast({
            title: "Check your email",
            description: "We sent a confirmation link to " + email + ". Please verify your email before signing in.",
          });
          setIsLogin(true);
          return;
        }

        // No email confirmation required → session is active, insert profile row
        if (data.user) {
          // Insert profile row with retry logic
          let profileCreated = false;
          for (let i = 0; i < 3; i++) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { error: insertError } = await (supabase.from("profiles") as any).insert({
                id: data.user.id,
                full_name: fullName,
                role,
              });

              if (!insertError) {
                profileCreated = true;
                break;
              }

              // 23505 = unique_violation (profile already exists, which is fine)
              if (insertError.code === "23505") {
                profileCreated = true;
                break;
              }

              // Retry on other errors
              if (i < 2) {
                await new Promise(resolve => setTimeout(resolve, 200 * (i + 1)));
              }
            } catch (err) {
              console.debug("[Auth] Profile insert attempt", i + 1, ":", err);
              if (i < 2) {
                await new Promise(resolve => setTimeout(resolve, 200 * (i + 1)));
              }
            }
          }

          if (!profileCreated) {
            console.warn("[Auth] Profile insert failed after 3 attempts");
          }

          toast({ title: "Account created", description: "Welcome to SkillBridge!" });
          navigate(DASHBOARD_PATH[role]);
        }
      }
    } finally {
      setLoading(false);
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
                  name="email"
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
                    name="password"
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
                {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="font-medium">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      name="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className={`bg-white border-gray-300 placeholder:text-gray-400 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      required 
                    />
                    {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
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
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 ml-2 order-last" />
                )}
                {isLogin ? "Sign In" : "Create Account"}
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
