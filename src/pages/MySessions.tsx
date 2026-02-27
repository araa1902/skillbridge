import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, VideoCamera as Video, DownloadSimple as Download, Star, ChatCircle as MessageCircle, CheckCircle as CheckCircle2, WarningCircle as AlertCircle, ArrowSquareOut as ExternalLink } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const MySessions = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // To be wired to Supabase in Phase 2
  const upcomingSessions: any[] = [];
  const completedSessions: any[] = [];
  const liveSessions: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">My Sessions</h1>
          <p className="text-xl text-gray-600">Manage your bookings and access session materials</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-2xl font-bold">{upcomingSessions.length}</p>
              <p className="text-gray-600">Upcoming</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{completedSessions.length}</p>
              <p className="text-gray-600">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">4.9</p>
              <p className="text-gray-600">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Sessions Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto md:grid-cols-3 mb-8">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="live">Live Now</TabsTrigger>
          </TabsList>

          {/* Upcoming Sessions */}
          <TabsContent value="upcoming" className="space-y-6">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <Card key={session.bookingId} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="grid lg:grid-cols-4 gap-6 items-center">
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-gray-500 text-white text-sm font-semibold">
                            {session.mentor.avatar}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">{session.title}</h3>
                            <p className="text-gray-600 mb-2">with {session.mentor.name}</p>
                            <Badge className={`
                              ${session.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-700' : ''}
                              ${session.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                            `}>
                              {session.bookingStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{session.bookedSlot.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{session.bookedSlot.time} {session.bookedSlot.timezone}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        {session.meetingLink && (
                          <Button asChild>
                            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                              <Video className="w-4 h-4 mr-2" />
                              Join Session
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message Mentor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming sessions</h3>
                  <p className="text-gray-600 mb-6">Browse available sessions and book your next learning experience</p>
                  <Button asChild>
                    <Link to="/sessions">Browse Sessions</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Sessions */}
          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No completed sessions yet</h3>
                <p className="text-gray-600 mb-6">Your completed sessions and recordings will appear here</p>
                <Button asChild>
                  <Link to="/sessions">Book Your First Session</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Sessions */}
          <TabsContent value="live" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No live sessions</h3>
                <p className="text-gray-600">Live sessions will appear here when they start</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MySessions;
