"use client"

import { Card } from "@/components/ui/card"
import { useEffect } from "react"

export function VisitorsChart() {
  useEffect(() => {
    const scriptElement = document.createElement("script")
    scriptElement.src = "https://public.tableau.com/javascripts/api/viz_v1.js"
    document.body.appendChild(scriptElement)

    return () => {
      if (document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement)
      }
    }
  }, [])

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Visitors Over Time</h3>
        <a
          href="https://public.tableau.com/views/4_1_17609679341500/Dashboard1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"
          target="_blank"
          rel="noopener noreferrer"
          className="text-chart-1 text-sm font-medium hover:underline"
        >
          View Report
        </a>
      </div>
      <div className="w-full overflow-hidden" style={{ height: "500px" }}>
        <div className="tableauPlaceholder" id="viz1762282331621" style={{ width: "100%", height: "100%" }}>
          <noscript>
            <a href="#">
              <img
                alt="Dashboard 1 "
                src="https://public.tableau.com/static/images/4_/4_1_17609679341500/Dashboard1/1_rss.png"
                style={{ border: "none" }}
              />
            </a>
          </noscript>
          <object className="tableauViz" style={{ width: "100%", height: "100%" }}>
            <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
            <param name="embed_code_version" value="3" />
            <param name="site_root" value="" />
            <param name="name" value="4_1_17609679341500&#47;Dashboard1" />
            <param name="tabs" value="no" />
            <param name="toolbar" value="yes" />
            <param
              name="static_image"
              value="https://public.tableau.com/static/images/4_/4_1_17609679341500/Dashboard1/1.png"
            />
            <param name="animate_transition" value="yes" />
            <param name="display_static_image" value="yes" />
            <param name="display_spinner" value="yes" />
            <param name="display_overlay" value="yes" />
            <param name="display_count" value="yes" />
            <param name="language" value="en-US" />
          </object>
        </div>
      </div>
    </Card>
  )
}
