"use client"

import { Search, Bell, Menu } from "lucide-react"

export function Header() {
  return (
    <header className="bg-background border-b border-border px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden sm:block flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-foreground hover:bg-accent rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
          AP
        </div>
      </div>
    </header>
  )
}
