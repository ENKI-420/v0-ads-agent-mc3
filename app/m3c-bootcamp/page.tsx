import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, BookOpen, Award } from "lucide-react"
import Image from "next/image"

export default function M3CBootcampPage() {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold">M3C Bootcamp</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Course Thumbnail"
              width={300}
              height={200}
              className="rounded-md object-cover w-full h-48"
            />
            <h3 className="mt-4 text-lg font-semibold">Module 1: Strategic Planning</h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-3">
              Learn the fundamentals of strategic planning and goal setting for business growth.
            </p>
            <Button className="mt-4 w-full">
              <Play className="h-4 w-4 mr-2" />
              Start Module
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Course Thumbnail"
              width={300}
              height={200}
              className="rounded-md object-cover w-full h-48"
            />
            <h3 className="mt-4 text-lg font-semibold">Module 2: Financial Acumen</h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-3">
              Develop a strong understanding of financial statements and investment analysis.
            </p>
            <Button className="mt-4 w-full bg-transparent" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Resume Module
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Course Thumbnail"
              width={300}
              height={200}
              className="rounded-md object-cover w-full h-48"
            />
            <h3 className="mt-4 text-lg font-semibold">Module 3: Leadership & Team Building</h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-3">
              Master the art of effective leadership and building high-performing teams.
            </p>
            <Button className="mt-4 w-full bg-transparent" variant="outline">
              <Award className="h-4 w-4 mr-2" />
              View Certificate
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
