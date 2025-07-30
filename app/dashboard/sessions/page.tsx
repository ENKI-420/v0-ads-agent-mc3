import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"

export default function SessionsPage() {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold">Upcoming Sessions</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Team Sync Meeting</CardTitle>
            <CardDescription>Weekly sync-up for the product development team.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>July 15, 2025</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>10:00 AM - 11:00 AM PST</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span>Product Team</span>
            </div>
            <Button className="mt-4">Join Meeting</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Q3 Planning Workshop</CardTitle>
            <CardDescription>Strategic planning session for the third quarter.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>July 20, 2025</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>9:00 AM - 1:00 PM PST</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span>Leadership Team</span>
            </div>
            <Button className="mt-4">View Details</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Client Demo: Acme Corp</CardTitle>
            <CardDescription>Product demonstration for a potential new client.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>July 22, 2025</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>2:00 PM - 3:00 PM PST</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span>Sales & Marketing</span>
            </div>
            <Button className="mt-4">Prepare for Demo</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Ethics Discussion</CardTitle>
            <CardDescription>Internal discussion on ethical considerations in AI development.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>July 25, 2025</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>11:00 AM - 12:00 PM PST</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span>Engineering Team</span>
            </div>
            <Button className="mt-4">Join Discussion</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
