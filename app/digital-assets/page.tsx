import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Upload, FileText, Video, Music } from "lucide-react"
import Image from "next/image"

export default function DigitalAssetsPage() {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold">Digital Assets</h1>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input placeholder="Search assets..." className="w-full pl-10" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
        <Button>
          <Upload className="h-5 w-5 mr-2" />
          Upload Asset
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="relative h-40 w-full overflow-hidden rounded-md">
              <Image
                src="/placeholder.svg?height=160&width=240"
                alt="Asset Thumbnail"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <Button variant="secondary" size="sm">
                  View
                </Button>
              </div>
            </div>
            <div className="mt-2 text-sm font-medium">Product Mockup V2</div>
            <div className="text-xs text-gray-500">Image | 2.5 MB</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="relative h-40 w-full overflow-hidden rounded-md flex items-center justify-center bg-gray-100">
              <FileText className="h-12 w-12 text-gray-400" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <Button variant="secondary" size="sm">
                  View
                </Button>
              </div>
            </div>
            <div className="mt-2 text-sm font-medium">Annual Report 2024</div>
            <div className="text-xs text-gray-500">Document | 10.2 MB</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="relative h-40 w-full overflow-hidden rounded-md flex items-center justify-center bg-gray-100">
              <Video className="h-12 w-12 text-gray-400" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <Button variant="secondary" size="sm">
                  View
                </Button>
              </div>
            </div>
            <div className="mt-2 text-sm font-medium">Marketing Explainer Video</div>
            <div className="text-xs text-gray-500">Video | 50.1 MB</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="relative h-40 w-full overflow-hidden rounded-md flex items-center justify-center bg-gray-100">
              <Music className="h-12 w-12 text-gray-400" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <Button variant="secondary" size="sm">
                  View
                </Button>
              </div>
            </div>
            <div className="mt-2 text-sm font-medium">Brand Jingle</div>
            <div className="text-xs text-gray-500">Audio | 1.1 MB</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
