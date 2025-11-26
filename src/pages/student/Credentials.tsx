import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Award, Download, Share2, Search, ExternalLink, CheckCircle, Calendar, Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { credentials } from "@/lib/data";

const Credentials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredCredentials = credentials.filter((credential) => {
    const matchesSearch = credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         credential.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || (credential as any).category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedCredentials = filteredCredentials.sort((a, b) => {
    if (sortBy === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === "name") return a.title.localeCompare(b.title);
    return 0;
  });

  const stats = {
    total: credentials.length,
    thisMonth: credentials.filter(c => new Date(c.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    verified: (credentials as any[]).filter((c) => (c as any).verified).length,
  };

  const handleDownloadCredential = async (credential: any) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    
    // Set page dimensions and margins
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    
    // Add a subtle background
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add a border
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(2);
    doc.rect(margin, margin, contentWidth, pageHeight - 2 * margin);
    
    // Header with title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(50, 50, 50);
    const title = "Certificate of Achievement";
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, margin + 30);
    
    // Credential title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    const credTitle = credential.title;
    const credTitleWidth = doc.getTextWidth(credTitle);
    doc.text(credTitle, (pageWidth - credTitleWidth) / 2, margin + 60);
    
    // Issuer and date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const issuerText = `Issued by: ${credential.issuer}`;
    const dateText = `Date: ${credential.date}`;
    doc.text(issuerText, margin + 10, margin + 90);
    doc.text(dateText, pageWidth - margin - doc.getTextWidth(dateText) - 10, margin + 90);
    
    // Category and status if available
    let yPos = margin + 110;
    if (credential.category) {
      doc.text(`Category: ${credential.category}`, margin + 10, yPos);
      yPos += 10;
    }
    if (credential.verified) {
      doc.setTextColor(34, 197, 94);
      doc.text("Status: Verified", margin + 10, yPos);
      doc.setTextColor(100, 100, 100);
      yPos += 10;
    }
    
    // Description
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const wrappedDesc = doc.splitTextToSize(credential.description, contentWidth - 20);
    doc.text(wrappedDesc, margin + 10, yPos + 10);
    
    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    const footerText = "Generated via SkillBridge";
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - margin - 10);
    
    // Save the PDF
    doc.save(`${credential.title.replace(/\s+/g, "_").toLowerCase()}_certificate.pdf`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30">
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Credentials</h1>
                <p className="text-gray-600 mt-1">Showcase your verified achievements and skills</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Earned</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.thisMonth}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Verified</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.verified}</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search credentials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/70 border-gray-200"
                  />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-white/70 border-gray-200">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/70 border-gray-200">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {sortedCredentials.length} of {credentials.length} credentials
            </p>
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCredentials.map((credential) => (
              <Card key={credential.id} className="group bg-white/80 backdrop-blur-sm border-gray-200/60 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:from-gray-100 group-hover:to-gray-200 transition-all duration-300">
                      <Award className="h-10 w-10 text-gray-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-gray-800 group-hover:text-gray-700 transition-colors">
                    {credential.title}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Building className="h-3 w-3" />
                    <span>{credential.issuer}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    {credential.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      <Calendar className="h-3 w-3 mr-1" />
                      {credential.date}
                    </Badge>
                    {(credential as any).verified && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-white/70 hover:bg-gray-50 border-gray-200 text-gray-700"
                      onClick={() => handleDownloadCredential(credential)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-white/70 hover:bg-gray-50 border-gray-200 text-gray-700">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedCredentials.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Award className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchQuery || categoryFilter !== "all" ? "No matching credentials" : "No credentials yet"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery || categoryFilter !== "all" 
                    ? "Try adjusting your search or filter criteria to find what you're looking for."
                    : "Complete projects to earn verified micro-credentials that showcase your skills to potential employers."
                  }
                </p>
                <Button className="bg-gray-600 hover:bg-gray-700">
                  Browse Projects
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Credentials;
