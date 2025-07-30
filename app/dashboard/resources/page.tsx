import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, Video, BookOpen, LinkIcon } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold">Resources</h1>
      <div className="relative">
        <Input placeholder="Search resources..." className="w-full pl-10" />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <FileText className="h-6 w-6 text-blue-500" />
            <CardTitle>Q3 Financial Report</CardTitle>
            <CardDescription>Detailed analysis of Q3 performance and projections.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="outline">View Document</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Video className="h-6 w-6 text-green-500" />
            <CardTitle>Product Launch Webinar</CardTitle>
            <CardDescription>Recording of the "Project Phoenix" launch event.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="outline">Watch Video</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <BookOpen className="h-6 w-6 text-purple-500" />
            <CardTitle>Employee Handbook</CardTitle>
            <CardDescription>Comprehensive guide to company policies and benefits.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="outline">Read Handbook</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <LinkIcon className="h-6 w-6 text-red-500" />
            <CardTitle>Brand Guidelines</CardTitle>
            <CardDescription>Official guidelines for brand usage and visual identity.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="outline">View Guidelines</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <FileText className="h-6 w-6 text-yellow-500" />
            <CardTitle>Marketing Strategy 2024</CardTitle>
            <CardDescription>Overview of marketing initiatives for the upcoming year.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="outline">View Document</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Video className="h-6 w-6 text-indigo-500" />
            <CardTitle>Onboarding Training Modules</CardTitle>
            <CardDescription>Video series for new employee orientation.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="outline">Start Training</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
