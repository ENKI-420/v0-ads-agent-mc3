import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Edit, Eye } from "lucide-react"

interface WorkbookCardProps {
  title: string
  description: string
  lastEdited: string
  progress: number
}

export function WorkbookCard({ title, description, lastEdited, progress }: WorkbookCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Last Edited: {lastEdited}</span>
          <span>Progress: {progress}%</span>
        </div>
        <Progress value={progress} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
