import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Buildings as Building2, Student as School, Eye, EyeSlash as EyeOff, SpinnerGap as Loader2, ArrowRight, CheckCircle as CheckCircle2, WarningCircle as AlertCircle } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

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
    <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
          "h-11 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
          "transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-0",
          error
            ? "border-red-400 focus-visible:ring-red-300"
            : "border-gray-200 dark:border-gray-700 focus-visible:ring-blue-400",
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const config = USER_TYPE_CONFIG[userType];
  const IconComponent = config.icon;

  const validate = (form: HTMLFormElement, email: string, password: string) => {
    const newErrors: Record<string, string> = {};

    if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    } else if (!isLogin && userType === "student" && !email.toLowerCase().endsWith(".ac.uk")) {
      newErrors.email = "Students must register with a university email (.ac.uk)";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      const confirmPassword = (form.elements.namedItem("confirm-password") as HTMLInputElement)?.value;
      if (password !== confirmPassword) {
        newErrors["confirm-password"] = "Passwords do not match";
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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
          return;
        }
        navigate(DASHBOARD_PATH[ROLE_MAP[userType]]);
      } else {
        const fullName = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
        const companyName =
          userType === "employer"
            ? (form.elements.namedItem("company-name") as HTMLInputElement)?.value.trim()
            : null;
        const role = ROLE_MAP[userType];

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
              ...(companyName ? { company_name: companyName } : {}),
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
          let profileCreated = false;
          for (let i = 0; i < 3; i++) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { error: insertError } = await (supabase.from("profiles") as any).insert({
                id: data.user.id,
                full_name: fullName,
                role,
                ...(companyName ? { company_name: companyName } : {}),
              });

              if (!insertError || insertError.code === "23505") {
                profileCreated = true;
                break;
              }

              if (i < 2) await new Promise((r) => setTimeout(r, 200 * (i + 1)));
            } catch (err) {
              if (i < 2) await new Promise((r) => setTimeout(r, 200 * (i + 1)));
            }
          }

          if (!profileCreated) console.warn("[Auth] Profile insert failed after 3 attempts");

          toast({ title: "Welcome to SkillBridge!", description: "Your account has been created." });
          navigate(DASHBOARD_PATH[role]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] space-y-6">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shadow-md",
                "bg-gradient-to-br",
                config.accentClass,
                "transition-transform duration-200 group-hover:scale-105"
              )}
            >
              <span className="text-white font-bold text-sm tracking-tight">SB</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              SkillBridge
            </span>
          </Link>
        </div>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div
          className={cn(
            "bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800",
            "shadow-lg shadow-gray-200/60 dark:shadow-gray-950/60",
            "ring-1",
            config.ringClass
          )}
        >
          {/* User type tabs */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              {(Object.keys(USER_TYPE_CONFIG) as UserTypeKey[]).map((type) => {
                const { icon: Icon, label, activeBg } = USER_TYPE_CONFIG[type];
                const isActive = userType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setUserType(type)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium",
                      "transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                      isActive
                        ? `${activeBg} text-white shadow-sm`
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Header */}
          <div className="px-6 pt-5 pb-2 text-center space-y-1">
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border mb-3",
                config.badge
              )}
            >
              <IconComponent className="h-3 w-3" />
              {config.label}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isLogin ? `Sign in` : `Create your account`}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{config.description}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 space-y-4">
            {!isLogin && (
              <Field
                id="name"
                label="Full Name"
                placeholder="Jane Doe"
                autoComplete="name"
                required
                error={errors.name}
              />
            )}

            {!isLogin && userType === "employer" && (
              <Field
                id="company-name"
                label="Company Name"
                placeholder="Acme Corp"
                autoComplete="organization"
                required
                error={errors["company-name"]}
              />
            )}

            <Field
              id="email"
              label="Email Address"
              type="email"
              placeholder={
                userType === "student"
                  ? "you@university.ac.uk"
                  : userType === "employer"
                    ? "you@company.com"
                    : "admin@university.ac.uk"
              }
              autoComplete="email"
              required
              error={errors.email}
            />

            <Field
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
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
                placeholder="••••••••"
                autoComplete="new-password"
                required
                error={errors["confirm-password"]}
              />
            )}

            {isLogin && (
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" className="h-4 w-4" />
                  <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start gap-2 pt-0.5">
                <Checkbox id="terms" required className="mt-0.5 h-4 w-4" />
                <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:underline dark:text-blue-400">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
                    Privacy Policy
                  </Link>
                </Label>
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
                "hover:opacity-90 active:scale-[0.98]",
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
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-1">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin((v) => !v);
                  setErrors({});
                }}
                className="font-semibold text-gray-900 dark:text-white hover:underline transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </form>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-5 text-xs text-gray-400 dark:text-gray-600">
          {["256-bit encryption", "GDPR compliant", "SOC 2 Type II"].map((badge) => (
            <span key={badge} className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {badge}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Auth;
