import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SessionCard } from "@/components/SessionCard";
import { MagnifyingGlass as Search, Faders as Filter, BookOpen, Users, Clock } from "@phosphor-icons/react";

const BrowseSessions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const categories = ["All", "Web Development", "Data Science", "Design", "Mobile Development", "DevOps"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  // To be connected to Supabase in Phase 2
  const sessions: any[] = [];
  const filteredSessions: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Learn from <span className="text-slate-700">Industry Experts</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book one-on-one sessions, join group workshops, and accelerate your career with personalized mentorship
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <BookOpen className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{sessions.length}+</p>
            <p className="text-gray-600">Active Sessions</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <Users className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">50+</p>
            <p className="text-gray-600">Expert Mentors</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <Clock className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">1000+</p>
            <p className="text-gray-600">Hours Taught</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search sessions, mentors, or skills..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full lg:w-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Level Filter */}
            <div className="flex gap-2">
              {levels.map((level) => (
                <Badge
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  className={`cursor-pointer ${selectedLevel === level ? 'bg-slate-700 hover:bg-slate-800' : 'hover:bg-gray-100'
                    }`}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
          </p>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} {...session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">No sessions found matching your criteria</p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedLevel("All");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseSessions;
