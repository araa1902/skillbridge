import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { projects } from "@/lib/data";

const BrowseProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === "all" || project.tags.includes(industryFilter);
    const matchesDuration = durationFilter === "all" || project.duration === durationFilter;
    
    return matchesSearch && matchesIndustry && matchesDuration;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Browse Projects</h1>
            <p className="text-lg text-muted-foreground">
              Find the perfect project to gain real-world experience
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by project or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="UX Design">UX Design</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Content">Content</SelectItem>
                <SelectItem value="Sustainability">Sustainability</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
              </SelectContent>
            </Select>

            <Select value={durationFilter} onValueChange={setDurationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="3 weeks">3 weeks</SelectItem>
                <SelectItem value="4 weeks">4 weeks</SelectItem>
                <SelectItem value="5 weeks">5 weeks</SelectItem>
                <SelectItem value="6 weeks">6 weeks</SelectItem>
                <SelectItem value="8 weeks">8 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseProjects;
