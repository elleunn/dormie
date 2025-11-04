"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardLayout from "@/components/dashboard/layout"

export default function Home() {
  return (
    <SidebarProvider>
      <DashboardLayout />
    </SidebarProvider>
  )
}
