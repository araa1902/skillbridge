import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "@/components/ProjectCard";
import { Link } from "react-router-dom";
import { Medal as Award, Briefcase, Users, ArrowRight, CheckCircle as CheckCircle2, Sparkle as Sparkles, TrendUp as TrendingUp, Buildings as Building2, GraduationCap, Lightning as Zap, List as Menu, X } from "@phosphor-icons/react";
import heroIllustration from "@/assets/hero-illustration.png";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock projects & testimonials removed. Update with Supabase queries later if desired.
  const featuredProjects: any[] = [];
  const testimonials: any[] = [];


  const features = [
    {
      icon: Briefcase,
      title: "Real Industry Projects",
      description: "Work on actual business challenges from leading companies",
      color: "text-slate-700",
      bgColor: "bg-slate-100"
    },
    {
      icon: Award,
      title: "Verified Credentials",
      description: "Earn blockchain-verified badges recognized by employers",
      color: "text-gray-700",
      bgColor: "bg-gray-100"
    },
    {
      icon: Users,
      title: "Direct Networking",
      description: "Connect with hiring managers and industry professionals",
      color: "text-slate-700",
      bgColor: "bg-slate-100"
    },
    {
      icon: TrendingUp,
      title: "Skill Development",
      description: "Build job-ready skills through hands-on experience",
      color: "text-gray-700",
      bgColor: "bg-gray-100"
    },
    {
      icon: Zap,
      title: "Fast Placement",
      description: "Get matched with opportunities in days, not months",
      color: "text-slate-700",
      bgColor: "bg-slate-100"
    },
    {
      icon: CheckCircle2,
      title: "Quality Assured",
      description: "University-vetted projects ensuring learning outcomes",
      color: "text-gray-700",
      bgColor: "bg-gray-100"
    },
  ];

  const benefits = [
    "Access to exclusive industry projects",
    "Portfolio-worthy work experience",
    "Mentorship from industry experts",
    "Flexible, remote-friendly opportunities",
    "Career guidance and support",
    "Competitive project stipends"
  ];

  const stats = [
    { value: "10,000+", label: "Students Connected" },
    { value: "200+", label: "Universities Trusted" },
    { value: "1,500+", label: "Projects Completed" },
    { value: "95%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Floating Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
        : 'bg-transparent'
        }`}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent">
                SkillBridge
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/browse-projects" className="text-gray-600 hover:text-slate-700 font-medium transition-colors">
                Projects
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-slate-700 font-medium transition-colors">
                About
              </Link>
              <Link to="/for-employers" className="text-gray-600 hover:text-slate-700 font-medium transition-colors">
                For Employers
              </Link>
              <Link to="/for-universities" className="text-gray-600 hover:text-slate-700 font-medium transition-colors">
                For Universities
              </Link>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4 animate-fade-in">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/browse-projects"
                  className="text-gray-600 hover:text-slate-700 font-medium px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Projects
                </Link>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-slate-700 font-medium px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/for-employers"
                  className="text-gray-600 hover:text-slate-700 font-medium px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  For Employers
                </Link>
                <Link
                  to="/for-universities"
                  className="text-gray-600 hover:text-slate-700 font-medium px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  For Universities
                </Link>
                <div className="flex flex-col space-y-2 px-4 pt-2 border-t border-gray-200">
                  <Button variant="outline" asChild>
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section - Modern with Gradient & Animation */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-100 pt-16 md:pt-20">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 -right-20 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-40 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div className="page-container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in">

                {/* Main Headline */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                    Bridge the gap between
                    <span className="bg-gradient-to-r from-slate-700 via-gray-800 to-slate-900 bg-clip-text text-transparent"> education</span> and
                    <span className="bg-gradient-to-r from-slate-700 via-gray-800 to-slate-900 bg-clip-text text-transparent"> employment</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                    Connect students with real-world projects, build verified credentials, and launch careers that matter.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="text-lg h-14 px-8 shadow-lg hover:shadow-xl transition-all" asChild>
                    <Link to="/auth">
                      Start Building Your Future
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-2" asChild>
                    <Link to="/browse-projects">Explore Projects</Link>
                  </Button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="border-2 border-white w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-gray-500 text-white flex items-center justify-center text-xs font-semibold">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Join students globally</p>
                    <p className="text-sm text-gray-600">already building their careers</p>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative animate-fade-in-up">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={heroIllustration}
                    alt="Students connecting with industry"
                    className="w-full h-auto"
                  />
                  {/* Floating Stats Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-lg rounded-xl p-4 shadow-xl animate-float">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-slate-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Sarah completed</p>
                          <p className="text-xs text-gray-600">Marketing Strategy Project</p>
                        </div>
                      </div>
                      <Badge className="bg-slate-100 text-slate-700">+1 Credential</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Modern Cards */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="page-container">
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Platform Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold">
                Everything you need to <span className="text-slate-700">succeed</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From finding opportunities to earning credentials, we've got you covered
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 page-container">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
                >
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section - Split Layout */}
        <section className="py-24 bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900 text-white">
          <div className="page-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center page-container">
              <div className="space-y-6">
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                  Why SkillBridge?
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Built for students who want more than a degree
                </h2>
                <p className="text-xl text-slate-200 leading-relaxed">
                  Get the practical experience and professional network that traditional education alone can't provide.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all"
                  >
                    <CheckCircle2 className="w-6 h-6 text-slate-200 flex-shrink-0 mt-0.5" />
                    <p className="text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-24 bg-white">
          <div className="page-container">
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
                <Briefcase className="w-3 h-3 mr-1" />
                Live Opportunities
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold">
                Start your journey with <span className="text-slate-700">real projects</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Browse hand-picked opportunities from leading companies
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 page-container">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" variant="outline" className="border-2" asChild>
                <Link to="/browse-projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials - Modern Design */}
        <section className="py-24 bg-gray-50">
          <div className="page-container">
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
                Success Stories
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold">
                Loved by students and <span className="text-slate-700">trusted</span> by employers
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 page-container">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="border-none shadow-lg hover:shadow-xl transition-all"
                >
                  <CardContent className="pt-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-400 to-gray-500 text-white flex items-center justify-center text-lg font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{testimonial.name}</p>
                        <p className="text-sm text-gray-600 font-medium">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.university || testimonial.company}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* For Employers/Universities Section */}
        <section className="py-24 bg-white">
          <div className="page-container">
            <div className="grid md:grid-cols-2 gap-8 page-container">
              {/* Employers */}
              <Card className="border-2 border-slate-100 hover:border-slate-300 transition-all hover:shadow-xl">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                    <Building2 className="w-8 h-8 text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">For Employers</h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Access a pool of motivated, pre-vetted students ready to tackle your business challenges.
                  </p>
                  <Button className="w-full" size="lg" asChild>
                    <Link to="/employer/dashboard">New Project</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Universities */}
              <Card className="border-2 border-gray-100 hover:border-gray-300 transition-all hover:shadow-xl">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                    <GraduationCap className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">For Universities</h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Enhance student outcomes with industry partnerships and real-world learning opportunities.
                  </p>
                  <Button className="w-full" variant="outline" size="lg" asChild>
                    <Link to="/university/dashboard">Partner With Us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA - Modern & Bold */}
        <section className="py-24 bg-gradient-to-r from-slate-800 via-gray-900 to-slate-900">
          <div className="page-container">
            <div className="max-w-4xl mx-auto text-center text-white space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Ready to transform your career?
              </h2>
              <p className="text-2xl text-slate-300">
                Join thousands of students building real-world experience today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" className="text-lg h-14 px-8 shadow-xl hover:shadow-2xl" asChild>
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                  <Link to="/browse-projects">Browse Projects</Link>
                </Button>
              </div>
              <p className="text-slate-300 text-sm">
                No credit card required • Free to join • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white border-y">
          <div className="page-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;