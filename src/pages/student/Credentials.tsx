import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Share2, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { credentials } from "@/lib/data";

const Credentials = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">My Micro-Credentials</h1>
            <p className="text-lg text-muted-foreground">
              View and share your verified achievements
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="recent">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Credentials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map((credential) => (
              <Card key={credential.id} className="hover:shadow-hover transition-smooth">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                    <Award className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="text-lg">{credential.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{credential.issuer}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {credential.description}
                  </p>
                  <div className="text-center">
                    <Badge variant="secondary">{credential.date}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {credentials.length === 0 && (
            <div className="text-center py-12">
              <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Credentials Yet</h3>
              <p className="text-muted-foreground mb-6">
                Complete projects to earn verified micro-credentials
              </p>
              <Button>Browse Projects</Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Credentials;
