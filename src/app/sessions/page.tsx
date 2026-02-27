import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, VideoCamera as Video, CheckCircle, XCircle } from "@phosphor-icons/react"

export default function SessionsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Sessions
            </h1>
            <p className="text-gray-600 mt-1">Manage your mentorship sessions</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            Book New Session
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="bg-white">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-white text-sm font-semibold">
                        SJ
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">React Advanced Patterns</h3>
                        <p className="text-sm text-gray-600">with Sarah Johnson</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Dec 20, 2024
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            2:00 PM - 3:00 PM
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Badge className="bg-blue-100 text-blue-700">1-on-1</Badge>
                          <Badge className="bg-green-100 text-green-700">Confirmed</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        <Video className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                      <Button variant="outline">Reschedule</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-400 text-white text-sm font-semibold">
                        JD
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">TypeScript Fundamentals</h3>
                        <p className="text-sm text-gray-600">with John Doe</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Dec 15, 2024
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                            Completed
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">View Notes</Button>
                      <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500">
                        Rate Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-pink-400 text-white text-sm font-semibold">
                    MW
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">System Design Basics</h3>
                    <p className="text-sm text-gray-600">with Mike Wilson</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Dec 10, 2024
                      </div>
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 mr-1 text-red-600" />
                        Cancelled by mentor
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
