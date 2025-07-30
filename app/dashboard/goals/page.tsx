import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function GoalsPage() {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold">Your Goals</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Q3 Revenue Target</CardTitle>
            <CardDescription>Achieve $10M in recurring revenue by end of Q3.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span>Progress: 75%</span>
              <span>$7.5M / $10M</span>
            </div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
            <CardDescription>Maintain an NPS score above 60.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span>Current NPS: 68</span>
              <span>Target: 60+</span>
            </div>
            <Progress value={80} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Launch</CardTitle>
            <CardDescription>Successfully launch "Project Phoenix" by October 1st.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span>Status: On Track</span>
              <span>Deadline: Sep 30</span>
            </div>
            <Progress value={90} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Team Growth</CardTitle>
            <CardDescription>Hire 5 new engineers for the AI division.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span>Progress: 60%</span>
              <span>3 / 5 Hired</span>
            </div>
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Market Expansion</CardTitle>
            <CardDescription>Enter 2 new international markets by year-end.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span>Status: In Progress</span>
              <span>Target: 2 Markets</span>
            </div>
            <Progress value={50} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Operational Efficiency</CardTitle>
            <CardDescription>Reduce cloud infrastructure costs by 15%.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span>Progress: 20%</span>
              <span>Current Savings: 5%</span>
            </div>
            <Progress value={20} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
