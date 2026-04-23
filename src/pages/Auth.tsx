import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Buildings as Building2, Student as School, Eye, EyeSlash as EyeOff, SpinnerGap as Loader2, ArrowRight, CheckCircle as CheckCircle2, WarningCircle as AlertCircle } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────

const ALLOWED_STUDENT_DOMAINS = [".ac.uk"];

// ─── Role Maps ───────────────────────────────────────────────────────────────

const ROLE_MAP: Record<"student" | "employer" | "university", UserRole> = {
  student: "student",
  employer: "business",
  university: "university",
};

const DASHBOARD_PATH: Record<UserRole, string> = {
  student: "/student/dashboard",
  business: "/employer/dashboard",
  university: "/university/dashboard",
};

// ─── User Type Config ────────────────────────────────────────────────────────

const USER_TYPE_CONFIG = {
  student: {
    icon: GraduationCap,
    label: "Student",
    accent: "blue",
    accentClass: "from-blue-500 to-blue-700",
    ringClass: "ring-blue-500/30",
    activeBg: "bg-blue-600",
    activeText: "text-blue-600",
    badge: "text-blue-700 bg-blue-50 border-blue-200",
    description: "Discover projects, build experience, earn credentials",
  },
  employer: {
    icon: Building2,
    label: "Employer",
    accent: "emerald",
    accentClass: "from-emerald-500 to-emerald-700",
    ringClass: "ring-emerald-500/30",
    activeBg: "bg-emerald-600",
    activeText: "text-emerald-600",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
    description: "Post projects, discover talent, build teams",
  },
  university: {
    icon: School,
    label: "University",
    accent: "violet",
    accentClass: "from-violet-500 to-violet-700",
    ringClass: "ring-violet-500/30",
    activeBg: "bg-violet-600",
    activeText: "text-violet-600",
    badge: "text-violet-700 bg-violet-50 border-violet-200",
    description: "Manage programs, track outcomes, connect with industry",
  },
} as const;

type UserTypeKey = keyof typeof USER_TYPE_CONFIG;

// ─── Sub-components ──────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  required?: boolean;
  rightElement?: React.ReactNode;
}

const Field = ({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  error,
  required,
  rightElement,
}: FieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <div className="relative">
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={cn(
          "h-11 rounded-lg border bg-white text-gray-900 placeholder:text-gray-400",
          "transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-0",
          error
            ? "border-red-400 focus-visible:ring-red-300"
            : "border-gray-200 focus-visible:ring-blue-400",
          rightElement && "pr-10"
        )}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {rightElement}
        </div>
      )}
    </div>
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        {error}
      </p>
    )}
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const Auth = () => {
  const [userType, setUserType] = useState<UserTypeKey>("student");
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, role } = useAuth();

  const config = USER_TYPE_CONFIG[userType];
  const IconComponent = config.icon;

  // ── Redirect if already logged in ──
  useEffect(() => {
    if (session && role) {
      const path = DASHBOARD_PATH[role] || "/student/dashboard";
      navigate(path);
    }
  }, [session, role, navigate]);

  const validate = (form: HTMLFormElement, email: string, password: string) => {
    const newErrors: Record<string, string> = {};

    if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    } else if (!isLogin && userType === "student") {
      const emailLower = email.toLowerCase();
      if (!ALLOWED_STUDENT_DOMAINS.some(domain => emailLower.endsWith(domain))) {
        newErrors.email = "Students must register with a valid university email";
      }
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      const confirmPassword = (form.elements.namedItem("confirm-password") as HTMLInputElement)?.value;
      if (password !== confirmPassword) {
        newErrors["confirm-password"] = "Passwords do not match";
      }
      if (!termsAccepted) {
        newErrors.terms = "You must agree to the Terms of Service and Privacy Policy";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const newErrors = validate(form, email, password);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
          return;
        }

        const userRole = data.user?.user_metadata?.role;
        const expectedRole = ROLE_MAP[userType];

        if (userRole && userRole !== expectedRole) {
          await supabase.auth.signOut();
          toast({
            title: "Login failed",
            description: `Please enter the correct credentials and select the right tab to sign in.`,
            variant: "destructive"
          });
          return;
        }

        // Navigate manually as a fallback for the useEffect to ensure immediate transition
        navigate(DASHBOARD_PATH[expectedRole]);
      } else {
        const fullName = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
        const role = ROLE_MAP[userType];

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
            },
          },
        });

        if (error) {
          toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
          return;
        }

        if (data.user && !data.session) {
          toast({
            title: "Check your inbox",
            description: `We sent a confirmation link to ${email}. Please verify before signing in.`,
          });
          setIsLogin(true);
          return;
        }

        if (data.user) {
          toast({ title: "Welcome to SkillBridge!", description: "Your account has been created." });
          navigate("/onboarding");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] space-y-6">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              SkillBridge
            </span>
          </Link>
        </div>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div
          className={cn(
            "bg-white rounded-2xl border border-gray-100",
            "shadow-lg shadow-gray-200/60",
            "ring-1",
            config.ringClass
          )}
        >
          {/* User type tabs */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="grid grid-cols-3 gap-2.5">
              {(Object.keys(USER_TYPE_CONFIG) as UserTypeKey[]).map((type) => {
                const { icon: Icon, label, activeBg, activeText } = USER_TYPE_CONFIG[type];
                const isActive = userType === type;
                return (
                  <div key={type} className="relative">
                    <button
                      type="button"
                      onClick={() => setUserType(type)}
                      className={cn(
                        "w-full flex flex-col items-center justify-center gap-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-medium",
                        "transition-all duration-200 focus:outline-none",
                        "border-2",
                        isActive
                          ? `${activeBg} text-white border-${activeBg.split('-')[1]}-600 shadow-md hover:shadow-lg`
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-center leading-tight">{label}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Header */}
          <div className="px-6 pt-5 pb-2 text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isLogin ? `Sign in` : `Create your account`}
            </h1>
            <p className="text-sm text-gray-500">{config.description}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 space-y-4">
            {!isLogin && (
              <Field
                id="name"
                label="Full Name"
                placeholder="Enter your full name..."
                autoComplete="name"
                required
                error={errors.name}
              />
            )}



            <Field
              id="email"
              label="Email Address"
              type="email"
              placeholder={
                userType === "student"
                  ? "Enter your university email..."
                  : userType === "employer"
                    ? "Enter your company email..."
                    : "Enter your admin email..."
              }
              autoComplete="email"
              required
              error={errors.email}
            />

            <Field
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password..."
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {!isLogin && (
              <Field
                id="confirm-password"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password again..."
                autoComplete="new-password"
                required
                error={errors["confirm-password"]}
              />
            )}

            {isLogin && (
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" className="h-4 w-4" />
                  <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {!isLogin && (
              <div className="flex flex-col gap-1 pt-0.5">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mt-0.5 h-4 w-4"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                    I agree to the <Link to="/terms-of-service" className="text-blue-600 hover:underline hover:text-blue-700" onClick={(e) => e.stopPropagation()}>Terms of Service</Link> and <Link to="/privacy-policy" className="text-blue-600 hover:underline hover:text-blue-700" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>
                  </Label>
                </div>
                {errors.terms && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors.terms}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full mt-2 h-11 rounded-lg font-semibold text-white text-sm",
                "flex items-center justify-center gap-2",
                "bg-gradient-to-r shadow-sm",
                config.accentClass,
                "active:scale-[0.98]",
                "transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isLogin ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Toggle sign-in / sign-up */}
            <p className="text-center text-sm text-gray-500 pt-1">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin((v) => !v);
                  setErrors({});
                }}
                className="font-semibold text-gray-900 hover:underline transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
