import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, Clock, Send, AlertCircle } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { projects } from "@/lib/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ApplicationStatus = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [message, setMessage] = useState("");

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Project not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const messages = [
    {
      sender: "employer",
      name: project.company,
      content: "Thank you for your application. We're reviewing it and will get back to you soon.",
      time: "2 days ago"
    },
    {
      sender: "you",
      name: "You",
      content: "Thank you! I'm very excited about this opportunity and looking forward to hearing from you.",
      time: "2 days ago"
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message send
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link to="/student/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold mb-2">Application Status</h1>
              <p className="text-muted-foreground">{project.title}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status Tracker */}
                <Card>
                  <CardHeader>
                    <CardTitle>Application Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-success-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">Submitted</h3>
                          <p className="text-sm text-muted-foreground">Application received</p>
                        </div>
                        <span className="text-sm text-muted-foreground">2 days ago</span>
                      </div>

                      <div className="ml-4 border-l-2 h-8"></div>

                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                          <Clock className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">Under Review</h3>
                          <p className="text-sm text-muted-foreground">Being reviewed by employer</p>
                        </div>
                        <Badge>In Progress</Badge>
                      </div>

                      <div className="ml-4 border-l-2 border-dashed h-8"></div>

                      <div className="flex items-center gap-4 opacity-40">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">Decision</h3>
                          <p className="text-sm text-muted-foreground">Awaiting final decision</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Communication Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${msg.sender === 'you' ? 'flex-row-reverse' : ''}`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {msg.sender === 'you' ? 'YO' : project.companyLogo}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex-1 ${msg.sender === 'you' ? 'text-right' : ''}`}>
                            <p className="text-sm font-medium mb-1">{msg.name}</p>
                            <div className={`inline-block p-3 rounded-lg ${
                              msg.sender === 'you' 
                                ? 'bg-accent text-accent-foreground' 
                                : 'bg-muted'
                            }`}>
                              <p className="text-sm">{msg.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Textarea
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={2}
                        className="resize-none"
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Company</p>
                      <p className="font-medium">{project.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="font-medium">{project.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <Link to={`/project/${project.id}`}>View Project</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-destructive/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Withdraw Application</h3>
                        <p className="text-sm text-muted-foreground">
                          You can withdraw your application at any time
                        </p>
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          Withdraw Application
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Your application will be permanently withdrawn
                            and you'll need to reapply if you change your mind.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, Withdraw
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplicationStatus;
