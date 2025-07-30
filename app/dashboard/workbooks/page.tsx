import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { WorkbookCard } from "@/components/dashboard/workbook-card"

export default function WorkbooksPage() {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold">Workbooks</h1>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input placeholder="Search workbooks..." className="w-full pl-10" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          New Workbook
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WorkbookCard
          title="Q3 Financial Analysis"
          description="Detailed financial analysis for the third quarter."
          lastEdited="2 days ago"
          progress={75}
        />
        <WorkbookCard
          title="Product Roadmap 2025"
          description="Strategic roadmap for product development in 2025."
          lastEdited="1 week ago"
          progress={90}
        />
        <WorkbookCard
          title="Marketing Campaign Plan"
          description="Comprehensive plan for the upcoming marketing campaign."
          lastEdited="3 days ago"
          progress={60}
        />
        <WorkbookCard
          title="HR Onboarding Flow"
          description="Documentation of the new employee onboarding process."
          lastEdited="4 days ago"
          progress={80}
        />
        <WorkbookCard
          title="Sales Performance Review"
          description="Review of sales team performance and targets."
          lastEdited="1 month ago"
          progress={40}
        />
        <WorkbookCard
          title="Customer Feedback Analysis"
          description="Summary and analysis of recent customer feedback."
          lastEdited="5 days ago"
          progress={95}
        />
      </div>
    </div>
  )
}
