import { Sidebar } from "./sidebar"
import { ReactNode } from "react"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
