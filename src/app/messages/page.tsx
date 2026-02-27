import { AppLayout } from "@/components/layout/app-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MagnifyingGlass as Search, PaperPlaneRight as Send, Paperclip, DotsThreeVertical as MoreVertical } from "@phosphor-icons/react"

export default function MessagesPage() {
  return (
    <AppLayout>
      <Card className="bg-white shadow-sm h-[calc(100vh-8rem)]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search messages..." className="pl-10" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-4 border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-white font-semibold">
                        M{i}
                      </div>
                      {i <= 2 && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm truncate">Sarah Johnson</p>
                        <span className="text-xs text-gray-500">2m ago</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        Thanks for the session! I learned a lot...
                      </p>
                      {i === 1 && (
                        <Badge className="mt-1 bg-blue-500 text-white">3 new</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-white font-semibold">
                  SJ
                </div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-xs text-green-600">● Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Received Message */}
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-white text-xs font-semibold shrink-0">
                  SJ
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                    <p className="text-sm">Hi! Thanks for booking the session. I'm looking forward to it!</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                </div>
              </div>

              {/* Sent Message */}
              <div className="flex items-start space-x-3 flex-row-reverse">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-400 text-white text-xs font-semibold">
                  ME
                </div>
                <div className="flex-1 flex flex-col items-end">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-3 max-w-md">
                    <p className="text-sm">Me too! I have some questions about React hooks that I'd like to discuss.</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">10:32 AM</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-white text-xs font-semibold shrink-0">
                  SJ
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                    <p className="text-sm">Perfect! We can cover that in detail. Feel free to prepare any specific examples.</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">10:35 AM</p>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5 text-gray-500" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </AppLayout>
  )
}
