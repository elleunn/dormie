"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MainContent } from "@/components/dashboard/main-content"
import { UploadTab } from "@/components/dashboard/upload-tab"

export default function DashboardLayout() {
  const [activeFilter, setActiveFilter] = useState("ALL")
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {activeTab === "upload" ? (
          <UploadTab />
        ) : (
          <MainContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        )}
      </div>
    </div>
  )
}
