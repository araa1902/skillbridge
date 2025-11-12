import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { Link } from "react-router-dom";
import { Award, Briefcase, Users, ArrowRight } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
import { projects, testimonials } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Index = () => {
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Empowering Students Through Real-World Projects
                </h1>
                <p className="text-lg text-muted-foreground">
                  SkillBridge connects students with real industry experiences to build employability through meaningful project work and verified micro-credentials.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link to="/auth">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/browse-projects">Browse Projects</Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <img 
                  src={heroIllustration} 
                  alt="Students connecting with industry" 
                  className="rounded-2xl shadow-elegant w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Cards */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-elegant">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Gain Real-World Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Work on genuine industry projects that make a real impact whilst building your portfolio and professional skills.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-elegant">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Earn Verified Micro-Credentials</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Receive digital credentials from employers that validate your skills and achievements to stand out in applications.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-elegant">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Connect with Employers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Build relationships with companies and showcase your abilities directly to potential employers.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
              <p className="text-lg text-muted-foreground">
                Explore opportunities to gain real-world experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/browse-projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What People Say</h2>
              <p className="text-lg text-muted-foreground">
                Hear from students and employers who use SkillBridge
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-none shadow-elegant">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar>
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.university || testimonial.company}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-primary-foreground border-none shadow-elegant">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                <p className="text-lg mb-8 opacity-90">
                  Join SkillBridge today and gain the experience that sets you apart
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/auth">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
