import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ExecutiveBlogPage() {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold">Executive Blog</h1>
      <div className="relative">
        <Input placeholder="Search articles..." className="w-full pl-10" />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Blog Post Thumbnail"
              width={300}
              height={200}
              className="rounded-md object-cover w-full h-48"
            />
            <h3 className="mt-4 text-lg font-semibold">The Future of AI in Business Operations</h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-3">
              Exploring how artificial intelligence is set to revolutionize various aspects of business operations, from
              automation to decision-making.
            </p>
            <Link href="#" className="inline-flex items-center mt-4 text-blue-600 hover:underline text-sm">
              Read More
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Blog Post Thumbnail"
              width={300}
              height={200}
              className="rounded-md object-cover w-full h-48"
            />
            <h3 className="mt-4 text-lg font-semibold">Navigating Global Market Volatility</h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-3">
              An executive perspective on strategies for businesses to thrive amidst unpredictable global economic
              shifts.
            </p>
            <Link href="#" className="inline-flex items-center mt-4 text-blue-600 hover:underline text-sm">
              Read More
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Blog Post Thumbnail"
              width={300}
              height={200}
              className="rounded-md object-cover w-full h-48"
            />
            <h3 className="mt-4 text-lg font-semibold">Leadership in the Digital Age</h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-3">
              Key principles for effective leadership in an increasingly digital and remote work environment.
            </p>
            <Link href="#" className="inline-flex items-center mt-4 text-blue-600 hover:underline text-sm">
              Read More
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
