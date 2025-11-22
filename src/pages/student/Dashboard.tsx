import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Compass, 
  Award,
  Briefcase,
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
  Brain
} from "lucide-react";
import { useState } from "react";

interface MatchedProject {
  id: number;
  title: string;
  company: string;
  matchScore: number;
  matchReasons: string[];
  budget: string;
  duration: string;
  skills: string[];
  careerPath: string;
  explorationValue: string;
}

export default function StudentDashboard() {
  const [studentProfile] = useState({
    name: "Alex Johnson",
    skills: ["React", "TypeScript", "Python", "UI/UX Design"],
    interests: ["Web Development", "Data Science", "UX Design"],
    careerAspiration: "Full-Stack Developer",
    explorationType: "actively-exploring", // or "focused", "undecided"
    completedProjects: 3,
    skillLevel: "intermediate"
  });

  const [recommendedProjects] = useState<MatchedProject[]>([
    {
      id: 1,
      title: "E-Commerce Platform Redesign",
      company: "TechStart Solutions",
      matchScore: 95,
      matchReasons: [
        "Matches your React & TypeScript skills",
        "Aligns with Full-Stack Developer career path",
        "Builds on your UI/UX Design interest"
      ],
      budget: "£800-£1200",
      duration: "4 weeks",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      careerPath: "Full-Stack Developer",
      explorationValue: "high"
    },
    {
      id: 2,
      title: "Data Visualization Dashboard",
      company: "Analytics Pro",
      matchScore: 88,
      matchReasons: [
        "Explores your Data Science interest",
        "Uses your Python skills",
        "Great for testing new field"
      ],
      budget: "£600-£1000",
      duration: "3 weeks",
      skills: ["Python", "Data Analysis", "Plotly"],
      careerPath: "Data Analyst",
      explorationValue: "exploration"
    },
    {
      id: 3,
      title: "Mobile App UX Research",
      company: "DesignFirst",
      matchScore: 82,
      matchReasons: [
        "Matches UX Design interest",
        "Low-risk exploration opportunity",
        "Complements web development skills"
      ],
      budget: "£500-£800",
      duration: "2 weeks",
      skills: ["UX Research", "Figma", "User Testing"],
      careerPath: "UX Designer",
      explorationValue: "exploration"
    }
  ]);

  const [careerInsights] = useState({
    topMatchedPaths: [
      { name: "Full-Stack Developer", score: 92, projects: 5 },
      { name: "Frontend Developer", score: 88, projects: 8 },
      { name: "Data Analyst", score: 75, projects: 3 }
    ],
    explorationSuggestions: [
      "Try a Data Science project to test your analytics interest",
      "Consider UX Design to complement development skills",
      "Explore DevOps to broaden your technical expertise"
    ]
  });

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-orange-600 bg-orange-50 border-orange-200";
  };

  const getExplorationBadge = (value: string) => {
    if (value === "high") return <Badge className="bg-green-100 text-green-700">High Match</Badge>;
    if (value === "exploration") return <Badge className="bg-purple-100 text-purple-700">Exploration</Badge>;
    return <Badge className="bg-blue-100 text-blue-700">Growth</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {studentProfile.name}! 👋
              </h1>
              <p className="text-gray-600">
                We've found {recommendedProjects.length} personalized opportunities for you
              </p>
            </div>
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* AI Matching Banner */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI-Powered Career Matching
                </h3>
                <p className="text-gray-700 mb-4">
                  Our intelligent matching engine has analyzed your skills, interests, and career aspirations 
                  to find the perfect projects for your journey. Explore different fields risk-free!
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="bg-white" asChild>
                    <Link to="/student/career-explorer">
                      <Compass className="h-4 w-4 mr-2" />
                      Explore Career Paths
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white" asChild>
                    <Link to="/student/settings">
                      Update Preferences
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Career Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-5 w-5 text-purple-600" />
                Career Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Strength</span>
                    <span className="text-sm font-semibold text-purple-600">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Top Career Matches:</p>
                  {careerInsights.topMatchedPaths.map((path, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{path.name}</span>
                      <span className="font-medium text-green-600">{path.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Projects Completed</span>
                  </div>
                  <span className="font-semibold text-gray-900">{studentProfile.completedProjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Skills Validated</span>
                  </div>
                  <span className="font-semibold text-gray-900">{studentProfile.skills.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Credentials Earned</span>
                  </div>
                  <span className="font-semibold text-gray-900">2</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exploration Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Compass className="h-5 w-5 text-orange-600" />
                Explore New Fields
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {careerInsights.explorationSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    </div>
                    <p className="text-sm text-gray-600">{suggestion}</p>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full mt-4">
                  View All Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Projects */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Recommended For You</h2>
              <p className="text-gray-600">Projects matched to your profile and career goals</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/browse-projects">
                View All Projects
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge 
                      className={`${getMatchScoreColor(project.matchScore)} border`}
                    >
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {project.matchScore}% Match
                    </Badge>
                    {getExplorationBadge(project.explorationValue)}
                  </div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Match Reasons */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Why this matches you:</p>
                      <ul className="space-y-1">
                        {project.matchReasons.map((reason, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills you'll use:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{project.budget}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{project.duration}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link to={`/project/${project.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/project/${project.id}/apply`}>
                          Apply Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Career Path Exploration */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-600 rounded-xl">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Not Sure About Your Career Path?
                </h3>
                <p className="text-gray-700 mb-4">
                  Use our Career Explorer tool to test different fields through short projects. 
                  Discover what you love before committing to a formal career pathway.
                </p>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Compass className="h-4 w-4 mr-2" />
                  Start Career Exploration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
