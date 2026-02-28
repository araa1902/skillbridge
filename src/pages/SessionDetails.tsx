import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Calendar, CurrencyDollar as PoundSterling, ArrowLeft, CheckCircle as CheckCircle2, MapPin, Medal as Award } from "@phosphor-icons/react";

const SessionDetails = () => {
  const { id } = useParams();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // TODO: Load session from Supabase (Phase 2)
  const session: any = null;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Session Not Found</h1>
          <Link to="/sessions">
            <Button>Browse Sessions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBookSession = () => {
    if (!selectedSlot) return;
    // Handle booking logic here
    alert(`Booking session for ${selectedSlot}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/sessions">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sessions
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-slate-100 text-slate-700">
                  {session.category}
                </Badge>
                <Badge variant="outline" className={`
                  ${session.level === 'Beginner' ? 'border-green-200 text-green-700 bg-green-50' : ''}
                  ${session.level === 'Intermediate' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' : ''}
                  ${session.level === 'Advanced' ? 'border-red-200 text-red-700 bg-red-50' : ''}
                `}>
                  {session.level}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {session.sessionType}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {session.title}
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                {session.description}
              </p>
            </div>

            {/* Session Info */}
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">Duration</p>
                      <p className="text-gray-600">{session.duration} minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">Capacity</p>
                      <p className="text-gray-600">{session.enrolled}/{session.maxCapacity} enrolled</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <PoundSterling className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">Price</p>
                      <p className="text-gray-600 text-xl font-bold">${session.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">Format</p>
                      <p className="text-gray-600">Online (Zoom/Google Meet)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Covered */}
            <Card>
              <CardHeader>
                <CardTitle>Skills You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {session.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-slate-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Live interactive session",
                  "Recording access for 30 days",
                  "Resource materials and notes",
                  "Direct Q&A with the mentor",
                  "Certificate of completion",
                  "Follow-up support via email"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mentor Card */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Your Mentor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-gray-500 text-white text-lg font-bold">
                    {session.mentor.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{session.mentor.name}</h3>
                    <p className="text-gray-600">{session.mentor.title}</p>
                    <p className="text-sm text-gray-500">{session.mentor.company}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{session.mentor.rating}</span>
                      <span className="text-gray-500 text-sm">(127 reviews)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-1">
                    {session.mentor.expertise.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Card */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book This Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-slate-700">${session.price}</p>
                  <p className="text-gray-600">per session</p>
                </div>

                <div>
                  <p className="font-semibold mb-3">Available Time Slots</p>
                  <div className="space-y-2">
                    {session.availableSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={selectedSlot === `${slot.date}-${slot.time}` ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedSlot(`${slot.date}-${slot.time}`)}
                      >
                        <div className="text-left">
                          <p className="font-semibold">{slot.date}</p>
                          <p className="text-sm opacity-80">{slot.time} {slot.timezone}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selectedSlot}
                  onClick={handleBookSession}
                >
                  {selectedSlot ? 'Book Session' : 'Select Time Slot'}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Free cancellation up to 24 hours before the session
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
