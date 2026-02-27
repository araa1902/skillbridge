import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MagnifyingGlass as Search, Star, ChatCircle as MessageSquare, Calendar } from "@phosphor-icons/react"

export default function MentorsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Mentor
          </h1>
          <p className="text-gray-600 mt-1">Connect with experienced professionals in your field</p>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by name, skill, or industry..." className="pl-10 bg-white" />
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            Filters
          </Button>
        </div>

        {/* Mentors Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-white text-lg font-bold">
                    M{i}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Sarah Johnson</h3>
                    <p className="text-sm text-gray-600">Senior Software Engineer</p>
                    <p className="text-xs text-gray-500">Google • 8 years exp</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">(127 reviews)</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">React</Badge>
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">TypeScript</Badge>
                  <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">System Design</Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  Passionate about mentoring developers and helping them grow their careers in tech...
                </p>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
