import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarBlankIcon, UsersIcon, ChatCircleIcon as MessageSquareIcon, TrendUpIcon as TrendingUpIcon, ClockIcon, ArrowRightIcon } from "@phosphor-icons/react"

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your mentorship journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Total Sessions</CardTitle>
              <CalendarBlankIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">24</div>
              <p className="text-xs text-blue-700 flex items-center mt-1">
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Active Mentors</CardTitle>
              <UsersIcon className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">8</div>
              <p className="text-xs text-purple-700 flex items-center mt-1">
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                +2 new this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-100 to-pink-50 border-pink-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-pink-900">Messages</CardTitle>
              <MessageSquareIcon className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-900">156</div>
              <p className="text-xs text-pink-700 flex items-center mt-1">
                <ClockIcon className="h-3 w-3 mr-1" />
                3 unread
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Hours Learned</CardTitle>
              <ClockIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">48h</div>
              <p className="text-xs text-green-700 flex items-center mt-1">
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                +8h this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Sessions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled mentorship sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-white font-semibold">
                    M{i}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">React Advanced Patterns</p>
                    <p className="text-xs text-gray-600">with Sarah Johnson</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarBlankIcon className="h-3 w-3 mr-1" />
                      Today, 2:00 PM
                    </div>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Join
                  </Button>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View all sessions <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: "Completed session", mentor: "John Doe", topic: "TypeScript Basics", time: "2 hours ago", color: "green" },
                { action: "New message from", mentor: "Jane Smith", topic: "Project feedback", time: "5 hours ago", color: "blue" },
                { action: "Session booked with", mentor: "Mike Wilson", topic: "System Design", time: "1 day ago", color: "purple" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`h-2 w-2 rounded-full bg-${activity.color}-500 mt-2`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="text-gray-600">{activity.action}</span>{" "}
                      <span className="font-medium">{activity.mentor}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.topic}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                View all activity <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Mentors */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recommended Mentors</CardTitle>
            <CardDescription>Based on your interests and goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-white font-semibold">
                      RM
                    </div>
                    <div>
                      <p className="font-medium">Robert Martinez</p>
                      <p className="text-xs text-gray-600">Senior Engineer at Tech Co</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">React</Badge>
                    <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">Node.js</Badge>
                  </div>
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
